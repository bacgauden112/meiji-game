'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PlayRegister() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/players/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Có lỗi xảy ra');
        setLoading(false);
        return;
      }

      // Store player info and navigate to quiz
      sessionStorage.setItem('playerId', data.playerId);
      sessionStorage.setItem('playerName', data.playerName);
      sessionStorage.setItem('remainingAttempts', String(data.remainingAttempts));
      router.push('/play/quiz');
    } catch {
      setError('Không thể kết nối. Vui lòng thử lại.');
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🍼</div>
        <h2>Đăng Ký Chơi</h2>
        <p>Nhập thông tin để bắt đầu thử tài pha sữa!</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Họ và tên</label>
            <input
              id="name"
              type="text"
              placeholder="Nhập họ tên của bạn"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input
              id="phone"
              type="tel"
              placeholder="Nhập số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              pattern="[0-9]{10,11}"
              title="Vui lòng nhập số điện thoại 10-11 chữ số"
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '8px' }}
          >
            {loading ? 'Đang xử lý...' : '🚀 Bắt Đầu'}
          </button>
        </form>
      </div>
    </div>
  );
}
