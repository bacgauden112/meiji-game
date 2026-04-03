import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { phone: { contains: search } },
          ],
        }
      : {};

    const [players, total] = await Promise.all([
      prisma.player.findMany({
        where,
        include: {
          sessions: {
            orderBy: { createdAt: 'desc' as const },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.player.count({ where }),
    ]);

    return NextResponse.json({
      players: players.map((p) => ({
        id: p.id,
        name: p.name,
        phone: p.phone,
        sessionCount: p.sessions.length,
        bestScore: p.sessions.length > 0
          ? Math.max(...p.sessions.map((s) => s.score))
          : 0,
        passed: p.sessions.some((s) => s.passed),
        lastPlayed: p.sessions.length > 0
          ? p.sessions[0].createdAt
          : null,
        createdAt: p.createdAt,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Admin players error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}
