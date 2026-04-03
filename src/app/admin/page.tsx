'use client';

import { useState, useEffect, useCallback } from 'react';

interface Stats {
  totalPlayers: number;
  totalSessions: number;
  todaySessions: number;
  passedSessions: number;
  passRate: number;
  maxSessionPerDay: number;
  remainingToday: number;
}

interface Config {
  maxRetryPerUser: number;
  maxSessionPerDay: number;
}

interface PlayerRow {
  id: string;
  name: string;
  phone: string;
  sessionCount: number;
  bestScore: number;
  passed: boolean;
  lastPlayed: string | null;
  createdAt: string;
}

interface PlayersResponse {
  players: PlayerRow[];
  total: number;
  page: number;
  totalPages: number;
}

export default function AdminDashboard() {
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [config, setConfig] = useState<Config>({ maxRetryPerUser: 2, maxSessionPerDay: 1000 });
  const [configDraft, setConfigDraft] = useState<Config>({ maxRetryPerUser: 2, maxSessionPerDay: 1000 });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [players, setPlayers] = useState<PlayerRow[]>([]);
  const [playersTotal, setPlayersTotal] = useState(0);
  const [playersPage, setPlayersPage] = useState(1);
  const [playersTotalPages, setPlayersTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const ADMIN_PASSWORD = 'meiji2026';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuth(true);
      setAuthError('');
    } else {
      setAuthError('Mật khẩu không đúng');
    }
  };

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  }, []);

  const fetchConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/config');
      const data = await res.json();
      setConfig(data);
      setConfigDraft({ maxRetryPerUser: data.maxRetryPerUser, maxSessionPerDay: data.maxSessionPerDay });
    } catch (err) {
      console.error('Failed to fetch config', err);
    }
  }, []);

  const fetchPlayers = useCallback(async (page: number, searchQuery: string) => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '15',
        ...(searchQuery && { search: searchQuery }),
      });
      const res = await fetch(`/api/admin/players?${params}`);
      const data: PlayersResponse = await res.json();
      setPlayers(data.players);
      setPlayersTotal(data.total);
      setPlayersTotalPages(data.totalPages);
    } catch (err) {
      console.error('Failed to fetch players', err);
    }
  }, []);

  useEffect(() => {
    if (isAuth) {
      fetchStats();
      fetchConfig();
      fetchPlayers(1, '');
    }
  }, [isAuth, fetchStats, fetchConfig, fetchPlayers]);

  const handleSaveConfig = async () => {
    setSaving(true);
    setSaveMsg('');
    try {
      const res = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configDraft),
      });
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
        setSaveMsg('✅ Đã lưu thành công!');
        setTimeout(() => setSaveMsg(''), 3000);
      }
    } catch {
      setSaveMsg('❌ Có lỗi xảy ra');
    }
    setSaving(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPlayersPage(1);
    fetchPlayers(1, searchInput);
  };

  const handlePageChange = (page: number) => {
    setPlayersPage(page);
    fetchPlayers(page, search);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  if (!isAuth) {
    return (
      <div className="register-container">
        <div className="admin-login-card">
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔐</div>
          <h2>Admin Dashboard</h2>
          {authError && <div className="error-message">{authError}</div>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="admin-password">Mật khẩu</label>
              <input
                id="admin-password"
                type="password"
                placeholder="Nhập mật khẩu admin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              Đăng Nhập
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>🍼 Meiji Game Admin</h1>
        <button
          className="btn-secondary"
          style={{ padding: '8px 20px', fontSize: '0.85rem' }}
          onClick={() => {
            setIsAuth(false);
            setPassword('');
          }}
        >
          Đăng xuất
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-icon">👥</div>
            <div className="stat-card-value">{stats.totalPlayers}</div>
            <div className="stat-card-label">Tổng người chơi</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon">🎮</div>
            <div className="stat-card-value">{stats.totalSessions}</div>
            <div className="stat-card-label">Tổng lượt chơi</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon">📅</div>
            <div className="stat-card-value">{stats.todaySessions}</div>
            <div className="stat-card-label">Lượt chơi hôm nay</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon">✅</div>
            <div className="stat-card-value">{stats.passRate}%</div>
            <div className="stat-card-label">Tỷ lệ đạt</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon">📊</div>
            <div className="stat-card-value">{stats.remainingToday}</div>
            <div className="stat-card-label">Lượt còn lại hôm nay</div>
          </div>
        </div>
      )}

      {/* Config */}
      <div className="config-section">
        <h2>⚙️ Cấu Hình</h2>
        <div className="config-grid">
          <div className="config-field">
            <label htmlFor="maxRetry">Số lượt chơi tối đa / người</label>
            <input
              id="maxRetry"
              type="number"
              min="1"
              value={configDraft.maxRetryPerUser}
              onChange={(e) =>
                setConfigDraft({ ...configDraft, maxRetryPerUser: parseInt(e.target.value) || 1 })
              }
            />
          </div>
          <div className="config-field">
            <label htmlFor="maxSession">Tổng lượt chơi tối đa / ngày</label>
            <input
              id="maxSession"
              type="number"
              min="1"
              value={configDraft.maxSessionPerDay}
              onChange={(e) =>
                setConfigDraft({ ...configDraft, maxSessionPerDay: parseInt(e.target.value) || 1 })
              }
            />
          </div>
          <div>
            <button
              className="btn-save"
              onClick={handleSaveConfig}
              disabled={saving || (
                configDraft.maxRetryPerUser === config.maxRetryPerUser &&
                configDraft.maxSessionPerDay === config.maxSessionPerDay
              )}
            >
              {saving ? 'Đang lưu...' : 'Lưu Cấu Hình'}
            </button>
            {saveMsg && (
              <span style={{ marginLeft: '12px', fontSize: '0.85rem', fontWeight: 600 }}>
                {saveMsg}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Players Table */}
      <div className="players-section">
        <h2>👥 Danh Sách Người Chơi ({playersTotal})</h2>
        <div className="search-bar">
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Tìm theo tên hoặc SĐT..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className="btn-save">
              Tìm
            </button>
          </form>
        </div>

        <div className="players-table-wrapper">
          <table className="players-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Tên</th>
                <th>SĐT</th>
                <th>Số lượt</th>
                <th>Điểm cao nhất</th>
                <th>Kết quả</th>
                <th>Lần chơi cuối</th>
              </tr>
            </thead>
            <tbody>
              {players.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '30px' }}>
                    Chưa có người chơi nào
                  </td>
                </tr>
              ) : (
                players.map((p, i) => (
                  <tr key={p.id}>
                    <td>{(playersPage - 1) * 15 + i + 1}</td>
                    <td><strong>{p.name}</strong></td>
                    <td>{p.phone}</td>
                    <td>{p.sessionCount}</td>
                    <td>{p.bestScore}/5</td>
                    <td>
                      <span className={`badge ${p.passed ? 'badge-success' : 'badge-fail'}`}>
                        {p.passed ? '✅ Đạt' : '❌ Chưa đạt'}
                      </span>
                    </td>
                    <td>{formatDate(p.lastPlayed)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {playersTotalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(playersPage - 1)}
              disabled={playersPage <= 1}
            >
              ←
            </button>
            {[...Array(playersTotalPages)].map((_, i) => (
              <button
                key={i + 1}
                className={playersPage === i + 1 ? 'active' : ''}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(playersPage + 1)}
              disabled={playersPage >= playersTotalPages}
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
