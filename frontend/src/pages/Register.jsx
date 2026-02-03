import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/shared-header.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', confirmPassword: '', fullName: '', phone: '', role: 'Farmer'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password || !formData.fullName) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (!agreed) {
      setError('Bạn cần đồng ý với điều khoản sử dụng');
      return;
    }

    setLoading(true); setError('');
    try {
      await api.post('/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone,
        role: formData.role
      });
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    } finally { setLoading(false); }
  };

  const getPasswordStrength = () => {
    const pwd = formData.password;
    if (!pwd) return { level: 0, text: '', color: '#e5e5e5' };
    if (pwd.length < 6) return { level: 1, text: 'Yếu', color: '#f44336' };
    if (pwd.length < 8) return { level: 2, text: 'Trung bình', color: '#ff9800' };
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return { level: 3, text: 'Mạnh', color: '#4caf50' };
    return { level: 2, text: 'Trung bình', color: '#ff9800' };
  };
  const strength = getPasswordStrength();

  return (
    <div style={styles.container}>
      <div style={styles.bgDecor1}>🍈</div>
      <div style={styles.bgDecor2}>🌳</div>

      <div style={styles.card}>
        <div style={styles.logoSection}>
          <span style={styles.logoIcon}>🍈</span>
          <h1 style={styles.title}>Đăng ký tài khoản</h1>
          <p style={styles.subtitle}>Tham gia DurianQR ngay hôm nay</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>👤 Họ và tên *</label>
              <input type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} style={styles.input} placeholder="Nguyễn Văn A" required />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>📧 Email *</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={styles.input} placeholder="email@example.com" required />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>🔑 Tên đăng nhập *</label>
              <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} style={styles.input} placeholder="username" required />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>📱 Số điện thoại</label>
              <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={styles.input} placeholder="0909xxxxxx" />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>🔒 Mật khẩu *</label>
              <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} style={styles.input} placeholder="Tối thiểu 6 ký tự" required />
              {formData.password && (
                <div style={styles.strengthBar}>
                  <div style={{ ...styles.strengthFill, width: `${strength.level * 33}%`, background: strength.color }}></div>
                </div>
              )}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>🔒 Xác nhận mật khẩu *</label>
              <input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} style={styles.input} placeholder="Nhập lại mật khẩu" required />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>👤 Vai trò</label>
            <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} style={styles.input}>
              <option value="Farmer">👨‍🌾 Nông dân</option>
              <option value="Cooperative">🏢 Hợp tác xã</option>
              <option value="Consumer">🛒 Người tiêu dùng</option>
            </select>
          </div>

          <div style={styles.checkboxGroup}>
            <input type="checkbox" id="agree" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={styles.checkbox} />
            <label htmlFor="agree" style={styles.checkboxLabel}>Tôi đồng ý với <a href="#" style={styles.link}>Điều khoản sử dụng</a> và <a href="#" style={styles.link}>Chính sách bảo mật</a></label>
          </div>

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Đang đăng ký...' : '📝 Đăng ký'}
          </button>
        </form>

        <div style={styles.links}>
          <p style={styles.linkText}>Đã có tài khoản? <Link to="/login" style={styles.link}>Đăng nhập</Link></p>
          <Link to="/" style={styles.backLink}>← Về trang chủ</Link>
        </div>
      </div>

      <p style={styles.footer}>© 2026 DurianQR - Hệ thống truy xuất nguồn gốc sầu riêng</p>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)', padding: '2rem', position: 'relative', overflow: 'hidden' },
  bgDecor1: { position: 'absolute', top: '10%', left: '10%', fontSize: '6rem', opacity: 0.1 },
  bgDecor2: { position: 'absolute', bottom: '10%', right: '10%', fontSize: '8rem', opacity: 0.1 },
  card: { background: 'white', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '560px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' },
  logoSection: { textAlign: 'center', marginBottom: '1.5rem' },
  logoIcon: { fontSize: '3rem', display: 'block', marginBottom: '0.5rem' },
  title: { fontSize: '1.5rem', fontWeight: 700, color: '#2d5a27', margin: '0 0 0.5rem', fontFamily: "'Playfair Display', serif" },
  subtitle: { color: '#666', margin: 0 },
  error: { padding: '0.75rem', background: '#ffebee', border: '1px solid #ffcdd2', borderRadius: '8px', color: '#c62828', marginBottom: '1rem', textAlign: 'center' },
  form: {},
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  formGroup: { marginBottom: '1rem' },
  label: { display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: 500, fontSize: '0.875rem' },
  input: { width: '100%', padding: '0.75rem', background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '0.9rem', boxSizing: 'border-box' },
  strengthBar: { height: '4px', background: '#e5e5e5', borderRadius: '2px', marginTop: '0.5rem', overflow: 'hidden' },
  strengthFill: { height: '100%', transition: 'all 0.3s ease' },
  checkboxGroup: { display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '1.5rem' },
  checkbox: { marginTop: '0.25rem' },
  checkboxLabel: { fontSize: '0.85rem', color: '#666' },
  btn: { width: '100%', padding: '1rem', background: '#2d5a27', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' },
  links: { textAlign: 'center', marginTop: '1.5rem' },
  linkText: { color: '#666', margin: '0 0 1rem' },
  link: { color: '#2d5a27', fontWeight: 600, textDecoration: 'none' },
  backLink: { color: '#888', textDecoration: 'none', fontSize: '0.9rem' },
  footer: { marginTop: '2rem', color: '#666', fontSize: '0.85rem' },
};

export default Register;
