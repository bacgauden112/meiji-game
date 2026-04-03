import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [totalPlayers, totalSessions, todaySessions, passedSessions, config] =
      await Promise.all([
        prisma.player.count(),
        prisma.gameSession.count(),
        prisma.gameSession.count({
          where: {
            createdAt: {
              gte: new Date(today),
            },
          },
        }),
        prisma.gameSession.count({
          where: { passed: true },
        }),
        prisma.gameConfig.findUnique({ where: { id: 'default' } }),
      ]);

    return NextResponse.json({
      totalPlayers,
      totalSessions,
      todaySessions,
      passedSessions,
      passRate: totalSessions > 0
        ? Math.round((passedSessions / totalSessions) * 100)
        : 0,
      maxSessionPerDay: config?.maxSessionPerDay ?? 1000,
      remainingToday: (config?.maxSessionPerDay ?? 1000) - todaySessions,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Có lỗi xảy ra' }, { status: 500 });
  }
}
