'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface GameResult {
  score: number;
  total: number;
  passed: boolean;
  remainingAttempts: number;
  results: {
    questionId: number;
    selected: string;
    correct: string;
    isCorrect: boolean;
  }[];
}

const recipeSteps = [
  { icon: '💧', title: 'Chuẩn bị nước ấm', text: 'Đun sôi nước rồi để nguội đến <strong>40°C - 50°C</strong>. Không dùng nước sôi 100°C vì sẽ phá hủy dưỡng chất.' },
  { icon: '🥛', title: 'Đong nước vào bình', text: 'Cho <strong>nước ấm vào bình trước</strong> theo đúng lượng cần pha.' },
  { icon: '🥄', title: 'Đong sữa bột', text: 'Dùng <strong>muỗng đong kèm theo hộp</strong> sữa Meiji, gạt ngang miệng muỗng.' },
  { icon: '🔄', title: 'Lắc đều', text: '<strong>Lắc nhẹ nhàng</strong> bình sữa theo chuyển động tròn, tránh tạo bọt khí.' },
  { icon: '🌡️', title: 'Kiểm tra nhiệt độ', text: '<strong>Nhỏ vài giọt lên cổ tay</strong> để kiểm tra nhiệt độ trước khi cho bé uống.' },
];

function Confetti() {
  const colors = ['#E60012', '#FFD700', '#FF9EB1', '#4CAF50', '#4A90D9', '#FF6B35'];
  const pieces = [...Array(40)].map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: 6 + Math.random() * 10,
    color: colors[Math.floor(Math.random() * colors.length)],
    duration: 2 + Math.random() * 2,
    delay: Math.random() * 1.5,
    rotation: 360 + Math.random() * 720,
    shape: Math.random() > 0.5 ? '50%' : '2px',
  }));

  return (
    <div className="confetti-container">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            '--confetti-x': `${p.x}%`,
            '--confetti-size': `${p.size}px`,
            '--confetti-color': p.color,
            '--confetti-duration': `${p.duration}s`,
            '--confetti-delay': `${p.delay}s`,
            '--confetti-rotation': `${p.rotation}deg`,
            borderRadius: p.shape,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<GameResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('gameResult');
    if (!stored) {
      router.push('/play');
      return;
    }
    setResult(JSON.parse(stored));
  }, [router]);

  const handlePlayAgain = () => {
    sessionStorage.removeItem('gameResult');
    sessionStorage.removeItem('playerId');
    sessionStorage.removeItem('playerName');
    sessionStorage.removeItem('remainingAttempts');
    router.push('/play');
  };

  if (!result) {
    return (
      <div className="result-container">
        <div className="loading">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="result-container">
      {result.passed && <Confetti />}

      <div className="result-card">
        <div className="result-icon">
          {result.passed ? '🎉' : '😢'}
        </div>
        <h1 className={`result-title ${result.passed ? 'success' : 'fail'}`}>
          {result.passed ? 'Chúc Mừng!' : 'Chưa Đúng Rồi!'}
        </h1>
        <p className="result-score">
          Bạn trả lời đúng <strong>{result.score}/{result.total}</strong> câu
        </p>

        {result.passed ? (
          <>
            <div className="recipe-section">
              <h3>🍼 Công Thức Pha Sữa Meiji</h3>
              {recipeSteps.map((step, i) => (
                <div className="recipe-step" key={i}>
                  <div className="recipe-step-number">{i + 1}</div>
                  <div className="recipe-step-text" dangerouslySetInnerHTML={{ __html: step.text }} />
                </div>
              ))}
              <div className="recipe-tip">
                💡 <strong>Mẹo:</strong> Sữa pha xong nên cho bé uống trong vòng 2 giờ. Không nên hâm nóng lại sữa đã pha.
              </div>
            </div>
          </>
        ) : (
          <p style={{ fontSize: '0.95rem', color: '#6B4E37', lineHeight: 1.6, marginBottom: '8px' }}>
            {result.remainingAttempts > 0
              ? `Đừng nản lòng! Bạn còn ${result.remainingAttempts} lượt chơi. Hãy thử lại nhé! 💪`
              : 'Bạn đã hết lượt chơi. Cảm ơn bạn đã tham gia! ❤️'}
          </p>
        )}

        <div className="result-actions">
          {result.remainingAttempts > 0 && (
            <button className="btn-primary" onClick={handlePlayAgain}>
              🔄 Chơi Lại
            </button>
          )}
          <button className="btn-secondary" onClick={handlePlayAgain}>
            🏠 Về Trang Chủ
          </button>
        </div>
      </div>
    </div>
  );
}
