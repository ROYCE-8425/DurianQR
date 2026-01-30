import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/auth.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await api.post('/auth/login', { username, password });
      localStorage.setItem('user', JSON.stringify(response.data));
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Floating Decorative Elements */}
      <div className="floating-elements">
        <div className="floating-bubble bubble-1"></div>
        <div className="floating-bubble bubble-2"></div>
        <div className="floating-bubble bubble-3"></div>
        <div className="floating-bubble bubble-4"></div>
        <div className="floating-bubble bubble-5"></div>
        <div className="floating-bubble bubble-6"></div>
        
        <div className="floating-durian durian-1">🍈</div>
        <div className="floating-durian durian-2">🍈</div>
        <div className="floating-durian durian-3">🌿</div>
        <div className="floating-durian durian-4">🌿</div>
      </div>

      {/* Login Card */}
      <div className="auth-card">
        {/* Logo Section */}
        <div className="auth-logo">
          <span className="auth-logo-icon">🍈</span>
          <h1 className="auth-title">DurianQR</h1>
          <p className="auth-subtitle">Truy xuất nguồn gốc sầu riêng</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="message message-error">
            ⚠️ {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Username Field */}
          <div className="form-group">
            <label className="form-label">Tên đăng nhập</label>
            <div className="form-input-wrapper">
              <input
                type="text"
                className="form-input"
                placeholder="Nhập tên đăng nhập..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
              <span className="form-icon">👤</span>
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <div className="form-input-wrapper">
              <input
                type="password"
                className="form-input"
                placeholder="Nhập mật khẩu..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <span className="form-icon">🔒</span>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? (
              <span className="btn-loading">
                <span className="spinner"></span>
                Đang đăng nhập...
              </span>
            ) : (
              '🚀 Đăng nhập'
            )}
          </button>
        </form>

        {/* Social Login Divider */}
        <div className="social-divider">
          <span>hoặc đăng nhập bằng</span>
        </div>

        {/* Social Buttons */}
        <div className="social-buttons">
          <button type="button" className="btn-social" title="Google">
            🔵
          </button>
          <button type="button" className="btn-social" title="Facebook">
            📘
          </button>
          <button type="button" className="btn-social" title="Zalo">
            💬
          </button>
        </div>

        {/* Footer Link */}
        <div className="auth-footer">
          <p>
            Chưa có tài khoản?{' '}
            <Link to="/register" className="auth-link">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
