import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
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

    return NextResponse.json(config);
  } catch (error) {
    console.error('Config GET error:', error);
    return NextResponse.json({ error: 'Có lỗi xảy ra' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { maxRetryPerUser, maxSessionPerDay } = body;

    const config = await prisma.gameConfig.update({
      where: { id: 'default' },
      data: {
        ...(maxRetryPerUser !== undefined && { maxRetryPerUser }),
        ...(maxSessionPerDay !== undefined && { maxSessionPerDay }),
      },
    });

    return NextResponse.json(config);
  } catch (error) {
    console.error('Config PUT error:', error);
    return NextResponse.json({ error: 'Có lỗi xảy ra' }, { status: 500 });
  }
}
