import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, phone } = await request.json();

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Vui lòng nhập đầy đủ tên và số điện thoại' },
        { status: 400 }
      );
    }

    // Check global daily session limit
    const config = await prisma.gameConfig.upsert({
      where: { id: 'default' },
      update: {},
      create: {
        id: 'default',
        maxRetryPerUser: 2,
        maxSessionPerDay: 1000,
        currentDayCount: 0,
        lastResetDate: '',
      },
    });

    const today = new Date().toISOString().split('T')[0];

    // Reset daily count if new day
    if (config.lastResetDate !== today) {
      await prisma.gameConfig.update({
        where: { id: 'default' },
        data: { currentDayCount: 0, lastResetDate: today },
      });
      config.currentDayCount = 0;
    }

    if (config.currentDayCount >= config.maxSessionPerDay) {
      return NextResponse.json(
        { error: 'Đã hết lượt chơi trong ngày hôm nay. Vui lòng quay lại vào ngày mai!' },
        { status: 429 }
      );
    }

    // Find or create player
    let player = await prisma.player.findFirst({
      where: { phone },
      include: { sessions: true },
    });

    if (!player) {
      player = await prisma.player.create({
        data: { name, phone },
        include: { sessions: true },
      });
    } else {
      // Update name if different
      if (player.name !== name) {
        player = await prisma.player.update({
          where: { id: player.id },
          data: { name },
          include: { sessions: true },
        });
      }
    }

    // Check retry limit
    const sessionCount = player.sessions.length;
    const remainingAttempts = config.maxRetryPerUser - sessionCount;

    if (remainingAttempts <= 0) {
      return NextResponse.json(
        {
          error: `Bạn đã sử dụng hết ${config.maxRetryPerUser} lượt chơi. Cảm ơn bạn đã tham gia!`,
          playerId: player.id,
          remainingAttempts: 0,
        },
        { status: 429 }
      );
    }

    return NextResponse.json({
      playerId: player.id,
      playerName: player.name,
      remainingAttempts,
      sessionCount,
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}
