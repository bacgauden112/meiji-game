'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <div className="landing-logo">🍼</div>
        <h1 className="landing-title">Thử Tài Pha Sữa</h1>
        <p className="landing-subtitle">
          Bạn có biết cách pha sữa Meiji chuẩn không?
          <br />
          Trả lời 5 câu hỏi để nhận công thức đầy đủ!
        </p>
        <Link href="/play" className="btn-primary">
          🎮 Bắt Đầu Chơi
        </Link>
      </div>
    </div>
  );
}
