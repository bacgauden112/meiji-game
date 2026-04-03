'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Question {
  id: number;
  question: string;
  ingredient: string;
  ingredientIcon: string;
  options: { label: string; value: string }[];
}

const questionsData: Question[] = [
  {
    id: 1,
    question: "Nhiệt độ nước phù hợp để pha sữa Meiji cho bé là bao nhiêu?",
    ingredient: "Nước ấm",
    ingredientIcon: "💧",
    options: [
      { label: "A", value: "40°C - 50°C" },
      { label: "B", value: "70°C" },
      { label: "C", value: "100°C" },
    ],
  },
  {
    id: 2,
    question: "Khi pha sữa Meiji, nên cho gì vào bình trước?",
    ingredient: "Sữa bột Meiji",
    ingredientIcon: "🥛",
    options: [
      { label: "A", value: "Sữa bột trước, nước sau" },
      { label: "B", value: "Nước trước, sữa bột sau" },
      { label: "C", value: "Cho cùng lúc" },
    ],
  },
  {
    id: 3,
    question: "Dùng dụng cụ gì để đong sữa bột Meiji chính xác?",
    ingredient: "Muỗng đong",
    ingredientIcon: "🥄",
    options: [
      { label: "A", value: "Muỗng ăn thông thường" },
      { label: "B", value: "Muỗng đong kèm theo hộp sữa" },
      { label: "C", value: "Ước lượng bằng mắt" },
    ],
  },
  {
    id: 4,
    question: "Sau khi cho sữa bột vào, cần làm gì tiếp theo?",
    ingredient: "Lắc đều",
    ingredientIcon: "🔄",
    options: [
      { label: "A", value: "Khuấy mạnh bằng thìa" },
      { label: "B", value: "Lắc nhẹ nhàng cho đến khi tan đều" },
      { label: "C", value: "Đun sôi lại" },
    ],
  },
  {
    id: 5,
    question: "Trước khi cho bé uống, cần kiểm tra gì?",
    ingredient: "Kiểm tra nhiệt độ",
    ingredientIcon: "🌡️",
    options: [
      { label: "A", value: "Nhỏ vài giọt lên cổ tay kiểm tra nhiệt độ" },
      { label: "B", value: "Cho bé uống ngay" },
      { label: "C", value: "Để nguội hoàn toàn rồi mới cho uống" },
    ],
  },
];

// SVG Bottle component
function MilkBottle({ fillLevel }: { fillLevel: number }) {
  const fillHeight = 120 * fillLevel;
  const fillY = 200 - fillHeight;

  return (
    <svg viewBox="0 0 100 260" className="bottle-svg">
      {/* Bottle cap */}
      <rect x="35" y="5" width="30" height="18" rx="4" fill="#E60012" />
      <rect x="32" y="20" width="36" height="8" rx="2" fill="#B8000E" />
      
      {/* Bottle neck */}
      <path d="M38 28 L38 55 Q38 60 33 70 L28 80 Q25 85 25 92 L25 92" 
            fill="none" stroke="#D4E6F1" strokeWidth="2" />
      <path d="M62 28 L62 55 Q62 60 67 70 L72 80 Q75 85 75 92 L75 92" 
            fill="none" stroke="#D4E6F1" strokeWidth="2" />
      
      {/* Bottle body */}
      <rect x="22" y="80" width="56" height="150" rx="12" 
            fill="rgba(255,255,255,0.85)" stroke="#D4E6F1" strokeWidth="2" />
      
      {/* Milk fill */}
      <clipPath id="bottleClip">
        <rect x="24" y="82" width="52" height="146" rx="10" />
      </clipPath>
      <rect 
        className="bottle-fill"
        x="24" 
        y={fillY} 
        width="52" 
        height={fillHeight + 30} 
        fill="url(#milkGradient)" 
        clipPath="url(#bottleClip)"
      />
      
      {/* Milk gradient */}
      <defs>
        <linearGradient id="milkGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF5E6" />
          <stop offset="100%" stopColor="#FFE8CC" />
        </linearGradient>
      </defs>
      
      {/* Bottle label */}
      <rect x="30" y="120" width="40" height="50" rx="6" fill="#E60012" opacity="0.9" />
      <text x="50" y="140" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold" fontFamily="Nunito">
        MEIJI
      </text>
      <text x="50" y="155" textAnchor="middle" fill="#FFD700" fontSize="5" fontWeight="bold" fontFamily="Nunito">
        MILK
      </text>
      
      {/* Measurement lines */}
      <line x1="70" y1="140" x2="74" y2="140" stroke="#D4E6F1" strokeWidth="1" />
      <line x1="70" y1="170" x2="74" y2="170" stroke="#D4E6F1" strokeWidth="1" />
      <line x1="70" y1="200" x2="74" y2="200" stroke="#D4E6F1" strokeWidth="1" />
    </svg>
  );
}

// Shake overlay component
function ShakeOverlay({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="shake-overlay">
      <div className="shake-bubbles">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bubble"
            style={{
              '--bubble-size': `${6 + Math.random() * 12}px`,
              '--bubble-duration': `${0.8 + Math.random() * 1}s`,
              '--bubble-x': `${20 + Math.random() * 60}%`,
              '--bubble-y': `${Math.random() * 30}%`,
              animationDelay: `${Math.random() * 0.5}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>
      <div className="shake-bottle">🍼</div>
      <div className="shake-text">Đang lắc sữa...</div>
    </div>
  );
}

export default function QuizPage() {
  const router = useRouter();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [flyingIngredient, setFlyingIngredient] = useState<{
    icon: string;
    x: number;
    y: number;
  } | null>(null);
  const [showGlow, setShowGlow] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showShake, setShowShake] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const bottleRef = useRef<HTMLDivElement>(null);

  // Check if player is registered
  useEffect(() => {
    const playerId = sessionStorage.getItem('playerId');
    if (!playerId) {
      router.push('/play');
    }
  }, [router]);

  const fillLevel = answers.length / questionsData.length;
  const question = questionsData[currentQ];

  const handleOptionClick = useCallback((label: string, event: React.MouseEvent<HTMLButtonElement>) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const btn = event.currentTarget;
    const btnRect = btn.getBoundingClientRect();
    const bottleEl = bottleRef.current;
    
    if (bottleEl) {
      const bottleRect = bottleEl.getBoundingClientRect();
      const bottleCenterX = bottleRect.left + bottleRect.width / 2;
      const bottleCenterY = bottleRect.top + bottleRect.height * 0.4;
      
      const startX = btnRect.left + btnRect.width / 2;
      const startY = btnRect.top + btnRect.height / 2;
      
      const endX = bottleCenterX - startX;
      const endY = bottleCenterY - startY;
      const midX = endX * 0.5;
      const midY = endY - 60;

      setFlyingIngredient({
        icon: question.ingredientIcon,
        x: startX,
        y: startY,
      });

      // Set CSS variables for the flying animation
      const flyEl = document.querySelector('.flying-ingredient') as HTMLElement;
      if (flyEl) {
        flyEl.style.setProperty('--fly-mid-x', `${midX}px`);
        flyEl.style.setProperty('--fly-mid-y', `${midY}px`);
        flyEl.style.setProperty('--fly-end-x', `${endX}px`);
        flyEl.style.setProperty('--fly-end-y', `${endY}px`);
      }

      // After a tiny delay, set the CSS vars on the next frame
      requestAnimationFrame(() => {
        const flyEl2 = document.querySelector('.flying-ingredient') as HTMLElement;
        if (flyEl2) {
          flyEl2.style.setProperty('--fly-mid-x', `${midX}px`);
          flyEl2.style.setProperty('--fly-mid-y', `${midY}px`);
          flyEl2.style.setProperty('--fly-end-x', `${endX}px`);
          flyEl2.style.setProperty('--fly-end-y', `${endY}px`);
        }
      });
    }

    // Store the answer
    const newAnswers = [...answers, label];
    setAnswers(newAnswers);

    // Show glow effect after ingredient arrives
    setTimeout(() => {
      setShowGlow(true);
      setShowSplash(true);
      setFlyingIngredient(null);
    }, 700);

    // Hide glow and move to next question
    setTimeout(() => {
      setShowGlow(false);
      setShowSplash(false);
      
      if (currentQ < questionsData.length - 1) {
        setCurrentQ(currentQ + 1);
        setIsTransitioning(false);
      } else {
        // All questions answered - show shake animation
        setShowShake(true);
      }
    }, 1200);
  }, [currentQ, answers, isTransitioning, question]);

  const handleShakeComplete = useCallback(async () => {
    setSubmitting(true);
    const playerId = sessionStorage.getItem('playerId');

    try {
      const res = await fetch('/api/game/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, answers }),
      });

      const data = await res.json();

      // Store result data
      sessionStorage.setItem('gameResult', JSON.stringify(data));
      router.push('/play/result');
    } catch {
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
      setShowShake(false);
      setSubmitting(false);
    }
  }, [answers, router]);

  if (!question) return null;

  return (
    <div className="quiz-container">
      {/* Shake overlay */}
      {showShake && <ShakeOverlay onComplete={handleShakeComplete} />}

      {/* Bottle area */}
      <div className="bottle-area" ref={bottleRef}>
        <div className="bottle-svg-wrapper">
          <MilkBottle fillLevel={fillLevel} />
          <div className={`bottle-glow ${showGlow ? 'active' : ''}`} />
        </div>

        {/* Splash particles */}
        {showSplash && (
          <div className="splash-effect">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="splash-particle"
                style={{
                  '--sx': `${(Math.random() - 0.5) * 60}px`,
                  '--sy': `${(Math.random() - 0.5) * 60}px`,
                  animationDelay: `${i * 0.05}s`,
                } as React.CSSProperties}
              />
            ))}
          </div>
        )}

        {/* Flying ingredient */}
        {flyingIngredient && (
          <div
            className="flying-ingredient"
            style={{
              left: flyingIngredient.x,
              top: flyingIngredient.y,
              position: 'fixed',
            }}
          >
            {flyingIngredient.icon}
          </div>
        )}

        {/* Collected ingredients display */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          display: 'flex',
          gap: '8px',
          fontSize: '1.5rem',
        }}>
          {answers.map((_, i) => (
            <span key={i} style={{
              animation: 'scaleIn 0.3s ease',
              opacity: 0.7,
            }}>
              {questionsData[i].ingredientIcon}
            </span>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar-container">
        <div className="progress-steps">
          {questionsData.map((_, i) => (
            <div
              key={i}
              className={`progress-step ${
                i < currentQ ? 'completed' : i === currentQ ? 'current' : ''
              }`}
            />
          ))}
        </div>
        <div className="progress-label">
          Câu {currentQ + 1}/{questionsData.length} • {question.ingredient}
        </div>
      </div>

      {/* Question card */}
      <div className="question-card" key={currentQ}>
        <div className="question-header">
          <span className="question-ingredient-badge">
            {question.ingredientIcon} {question.ingredient}
          </span>
        </div>
        <p className="question-text">{question.question}</p>
        <div className="options-list">
          {question.options.map((opt) => (
            <button
              key={opt.label}
              className="option-btn"
              onClick={(e) => handleOptionClick(opt.label, e)}
              disabled={isTransitioning || submitting}
            >
              <span className="option-label">{opt.label}</span>
              <span>{opt.value}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
