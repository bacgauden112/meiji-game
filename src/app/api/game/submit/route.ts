import { prisma } from '@/lib/db';
import { questions } from '@/lib/questions';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { playerId, answers } = await request.json();

    if (!playerId || !answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ' },
        { status: 400 }
      );
    }

    // Verify player exists
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      include: { sessions: true },
    });

    if (!player) {
      return NextResponse.json(
        { error: 'Người chơi không tồn tại' },
        { status: 404 }
      );
    }

    // Check config
    const config = await prisma.gameConfig.findUnique({
      where: { id: 'default' },
    });

    if (config && player.sessions.length >= config.maxRetryPerUser) {
      return NextResponse.json(
        { error: 'Bạn đã hết lượt chơi' },
        { status: 429 }
      );
    }

    // Calculate score
    let score = 0;
    const results: { questionId: number; selected: string; correct: string; isCorrect: boolean }[] = [];

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const playerAnswer = answers[i];
      const isCorrect = playerAnswer === q.correctAnswer;
      if (isCorrect) score++;
      results.push({
        questionId: q.id,
        selected: playerAnswer,
        correct: q.correctAnswer,
        isCorrect,
      });
    }

    const passed = score === questions.length;

    // Create session
    const session = await prisma.gameSession.create({
      data: {
        playerId,
        score,
        total: questions.length,
        passed,
        answers: JSON.stringify(answers),
      },
    });

    // Increment daily count
    const today = new Date().toISOString().split('T')[0];
    await prisma.gameConfig.update({
      where: { id: 'default' },
      data: {
        currentDayCount: { increment: 1 },
        lastResetDate: today,
      },
    });

    const remainingAttempts = config
      ? config.maxRetryPerUser - (player.sessions.length + 1)
      : 0;

    return NextResponse.json({
      sessionId: session.id,
      score,
      total: questions.length,
      passed,
      results,
      remainingAttempts,
    });
  } catch (error) {
    console.error('Submit error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}
