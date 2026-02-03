import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/shared-header.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    setLoading(true); setError('');
    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      const role = res.data.user?.Role;
      if (role === 'Admin') navigate('/admin');
      else if (role === 'Farmer') navigate('/farmer');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.container}>
      {/* Background decorations */}
      <div style={styles.bgDecor1}>🍈</div>
      <div style={styles.bgDecor2}>🌳</div>

      <div style={styles.card}>
        {/* Logo Section */}
        <div style={styles.logoSection}>
          <span style={styles.logoIcon}>🍈</span>
          <h1 style={styles.title}>DurianQR</h1>
          <p style={styles.subtitle}>Truy xuất nguồn gốc sầu riêng</p>
        </div>

        {/* Error Message */}
        {error && <div style={styles.error}>{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>👤 Tên đăng nhập</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              style={styles.input}
              placeholder="Nhập tên đăng nhập..."
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>🔒 Mật khẩu</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={styles.input}
              placeholder="Nhập mật khẩu..."
            />
          </div>

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Đang đăng nhập...' : '🔐 Đăng nhập'}
          </button>
        </form>

        {/* Links */}
        <div style={styles.links}>
          <p style={styles.linkText}>
            Chưa có tài khoản? <Link to="/register" style={styles.link}>Đăng ký ngay</Link>
          </p>
          <Link to="/" style={styles.backLink}>← Về trang chủ</Link>
        </div>
      </div>

      {/* Footer */}
      <p style={styles.footer}>© 2026 DurianQR - Hệ thống truy xuất nguồn gốc sầu riêng</p>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden',
  },
  bgDecor1: { position: 'absolute', top: '10%', left: '10%', fontSize: '6rem', opacity: 0.1 },
  bgDecor2: { position: 'absolute', bottom: '10%', right: '10%', fontSize: '8rem', opacity: 0.1 },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
  },
  logoSection: { textAlign: 'center', marginBottom: '2rem' },
  logoIcon: { fontSize: '4rem', display: 'block', marginBottom: '0.5rem' },
  title: { fontSize: '2rem', fontWeight: 700, color: '#2d5a27', margin: '0 0 0.5rem', fontFamily: "'Playfair Display', serif" },
  subtitle: { color: '#666', margin: 0 },
  error: { padding: '0.75rem', background: '#ffebee', border: '1px solid #ffcdd2', borderRadius: '8px', color: '#c62828', marginBottom: '1rem', textAlign: 'center' },
  form: {},
  formGroup: { marginBottom: '1.25rem' },
  label: { display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: 500 },
  input: { width: '100%', padding: '0.875rem 1rem', background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '1rem', background: '#2d5a27', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' },
  links: { textAlign: 'center', marginTop: '1.5rem' },
  linkText: { color: '#666', margin: '0 0 1rem' },
  link: { color: '#2d5a27', fontWeight: 600, textDecoration: 'none' },
  backLink: { color: '#888', textDecoration: 'none', fontSize: '0.9rem' },
  footer: { marginTop: '2rem', color: '#666', fontSize: '0.85rem' },
};

export default Login;
