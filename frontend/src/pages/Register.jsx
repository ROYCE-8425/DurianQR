import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    email: '',
    role: 'Farmer'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Password strength checker
  const getPasswordStrength = (password) => {
    if (!password) return null;
    if (password.length < 6) return 'weak';
    if (password.length < 10 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) return 'medium';
    return 'strong';
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    if (!agreeTerms) {
      setError('Vui lòng đồng ý với điều khoản sử dụng!');
      return;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    setLoading(true);
    
    try {
      const { confirmPassword, ...registerData } = formData;
      await api.post('/auth/register', registerData);
      setSuccess('🎉 Đăng ký thành công! Đang chuyển hướng...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
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

      {/* Register Card */}
      <div className="auth-card">
        {/* Logo Section */}
        <div className="auth-logo">
          <span className="auth-logo-icon">🍈</span>
          <h1 className="auth-title">Đăng ký tài khoản</h1>
          <p className="auth-subtitle">Tham gia DurianQR ngay hôm nay</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="message message-error">
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div className="message message-success">
            {success}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Full Name Field */}
          <div className="form-group">
            <label className="form-label">Họ và tên *</label>
            <div className="form-input-wrapper">
              <input
                type="text"
                name="fullName"
                className="form-input"
                placeholder="Nguyễn Văn A..."
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <span className="form-icon">📝</span>
            </div>
          </div>

          {/* Username Field */}
          <div className="form-group">
            <label className="form-label">Tên đăng nhập *</label>
            <div className="form-input-wrapper">
              <input
                type="text"
                name="username"
                className="form-input"
                placeholder="username123..."
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="username"
              />
              <span className="form-icon">👤</span>
            </div>
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="form-input-wrapper">
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="email@example.com..."
                value={formData.email}
                onChange={handleChange}
              />
              <span className="form-icon">📧</span>
            </div>
          </div>

          {/* Phone Field */}
          <div className="form-group">
            <label className="form-label">Số điện thoại</label>
            <div className="form-input-wrapper">
              <input
                type="tel"
                name="phone"
                className="form-input"
                placeholder="0901234567..."
                value={formData.phone}
                onChange={handleChange}
              />
              <span className="form-icon">📱</span>
            </div>
          </div>

          {/* Role Selection */}
          <div className="form-group">
            <label className="form-label">Bạn là *</label>
            <div className="form-input-wrapper">
              <select
                name="role"
                className="form-input"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="Farmer">🌱 Nông dân - Trồng và chăm sóc sầu riêng</option>
                <option value="Trader">🚚 Thương lái - Thu mua và xuất khẩu</option>
              </select>
              <span className="form-icon">👥</span>
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label className="form-label">Mật khẩu *</label>
            <div className="form-input-wrapper">
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Tối thiểu 6 ký tự..."
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
              <span className="form-icon">🔒</span>
            </div>
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div className={`strength-fill strength-${passwordStrength}`}></div>
                </div>
                <span className="strength-text">
                  {passwordStrength === 'weak' && '⚠️ Mật khẩu yếu'}
                  {passwordStrength === 'medium' && '🔶 Mật khẩu trung bình'}
                  {passwordStrength === 'strong' && '✅ Mật khẩu mạnh'}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label className="form-label">Xác nhận mật khẩu *</label>
            <div className="form-input-wrapper">
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                placeholder="Nhập lại mật khẩu..."
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
              <span className="form-icon">🔐</span>
            </div>
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <span className="strength-text" style={{ color: '#EF4444' }}>
                ❌ Mật khẩu không khớp
              </span>
            )}
            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <span className="strength-text" style={{ color: '#22C55E' }}>
                ✅ Mật khẩu khớp
              </span>
            )}
          </div>

          {/* Terms Checkbox */}
          <label className="checkbox-wrapper">
            <input
              type="checkbox"
              className="checkbox-input"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            <span className="checkbox-label">
              Tôi đồng ý với <a href="#">Điều khoản sử dụng</a> và{' '}
              <a href="#">Chính sách bảo mật</a>
            </span>
          </label>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? (
              <span className="btn-loading">
                <span className="spinner"></span>
                Đang đăng ký...
              </span>
            ) : (
              '🚀 Đăng ký ngay'
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="auth-footer">
          <p>
            Đã có tài khoản?{' '}
            <Link to="/login" className="auth-link">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
