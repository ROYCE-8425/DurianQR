import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/global.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    farms: 0,
    trees: 0,
    batches: 0,
    qrcodes: 0
  });
  const [farms, setFarms] = useState([]);
  const [recentBatches, setRecentBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [farmsRes, batchesRes, qrRes] = await Promise.all([
          api.get('/farms'),
          api.get('/batches'),
          api.get('/qr')
        ]);

        setFarms(farmsRes.data);
        setRecentBatches(batchesRes.data.slice(0, 5));

        // Calculate stats
        const totalTrees = farmsRes.data.reduce((sum, farm) =>
          sum + (farm.trees?.length || 0), 0);

        setStats({
          farms: farmsRes.data.length,
          trees: totalTrees,
          batches: batchesRes.data.length,
          qrcodes: qrRes.data.length
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
    else setLoading(false);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Footer Component with Contact Info
  const Footer = () => (
    <footer className="page-footer" style={{ marginTop: '4rem' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '3rem',
        maxWidth: '1400px',
        margin: '0 auto 3rem',
        textAlign: 'left'
      }}>
        {/* About */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '2.5rem' }}>🍈</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 700, background: 'linear-gradient(135deg, #81C784, #FFF59D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>DurianQR</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.1rem' }}>
            Hệ thống truy xuất nguồn gốc sầu riêng thông minh - Minh bạch từ nông trại đến bàn ăn.
          </p>
        </div>

        {/* Contact Info */}
        <div>
          <h4 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary-yellow)', marginBottom: '1.5rem' }}>
            📞 Liên hệ
          </h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
              <span>🏢</span>
              <span>HUTECH - TP. Hồ Chí Minh</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
              <span>📍</span>
              <span>475A Điện Biên Phủ, Q. Bình Thạnh</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
              <span>📱</span>
              <span>Hotline: 1900 xxxx xx</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
              <span>✉️</span>
              <span>support@durianqr.vn</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
              <span>⏰</span>
              <span>T2 - T7: 8:00 - 17:30</span>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary-yellow)', marginBottom: '1.5rem' }}>
            🔗 Liên kết nhanh
          </h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.8rem' }}>
              <Link to="/" style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', textDecoration: 'none', transition: 'color 0.3s' }}>
                🏠 Trang chủ
              </Link>
            </li>
            <li style={{ marginBottom: '0.8rem' }}>
              <Link to="/trace" style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', textDecoration: 'none' }}>
                🔍 Truy xuất nguồn gốc
              </Link>
            </li>
            <li style={{ marginBottom: '0.8rem' }}>
              <Link to="/guide" style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', textDecoration: 'none' }}>
                📖 Hướng dẫn sử dụng
              </Link>
            </li>
            <li style={{ marginBottom: '0.8rem' }}>
              <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', textDecoration: 'none' }}>
                📋 Chính sách bảo mật
              </a>
            </li>
            <li>
              <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', textDecoration: 'none' }}>
                📜 Điều khoản sử dụng
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div style={{
        borderTop: '1px solid var(--glass-border)',
        paddingTop: '2rem',
        textAlign: 'center'
      }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          © 2026 DurianQR. Bản quyền thuộc về <strong style={{ color: 'var(--primary-yellow)' }}>HUTECH</strong>.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
          Phát triển bởi Team DurianQR 🍈
        </p>
      </div>
    </footer>
  );

  // Not logged in - Landing Page
  if (!user) {
    return (
      <div className="page-container">
        {/* Hero Section */}
        <div className="hero-section">
          <span className="hero-icon">🍈</span>
          <h1 className="hero-title">DurianQR</h1>
          <p className="hero-description">
            Hệ thống truy xuất nguồn gốc sầu riêng thông minh - Minh bạch từ nông trại đến bàn ăn
          </p>
          <div className="btn-group" style={{ justifyContent: 'center' }}>
            <Link to="/login" className="btn btn-accent btn-lg">
              🔐 Đăng nhập
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg">
              📝 Đăng ký tài khoản
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <Link to="/login" className="quick-action-btn">
            <span className="icon">🔐</span>
            <span>Đăng nhập</span>
          </Link>
          <Link to="/register" className="quick-action-btn">
            <span className="icon">📝</span>
            <span>Đăng ký</span>
          </Link>
          <Link to="/trace" className="quick-action-btn">
            <span className="icon">🔍</span>
            <span>Truy xuất nguồn gốc</span>
          </Link>
          <Link to="/guide" className="quick-action-btn">
            <span className="icon">📖</span>
            <span>Hướng dẫn sử dụng</span>
          </Link>
        </div>

        {/* Features Section */}
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">
              <span>✨</span> Tính năng nổi bật
            </h2>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📱</div>
              <div className="stat-value">QR</div>
              <div className="stat-label">Quét mã nhanh chóng</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🌳</div>
              <div className="stat-value">100%</div>
              <div className="stat-label">Theo dõi nguồn gốc</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-value">24/7</div>
              <div className="stat-label">Giám sát liên tục</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-value">VietGAP</div>
              <div className="stat-label">Tiêu chuẩn chất lượng</div>
            </div>
          </div>
        </div>

        {/* Why DurianQR Section */}
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">
              <span>🎯</span> Tại sao chọn DurianQR?
            </h2>
          </div>
          <div className="content-grid">
            <div className="glass-card">
              <div className="card-header">
                <h3 className="card-title">
                  <span className="icon">🔒</span>
                  An toàn thực phẩm
                </h3>
              </div>
              <div className="card-body">
                <p style={{ lineHeight: '1.8' }}>
                  Kiểm soát thời gian cách ly sau phun thuốc BVTV, đảm bảo sản phẩm an toàn cho người tiêu dùng và đạt chuẩn xuất khẩu.
                </p>
              </div>
            </div>
            <div className="glass-card">
              <div className="card-header">
                <h3 className="card-title">
                  <span className="icon">📈</span>
                  Tăng giá trị sản phẩm
                </h3>
              </div>
              <div className="card-body">
                <p style={{ lineHeight: '1.8' }}>
                  Sản phẩm có truy xuất nguồn gốc rõ ràng được khách hàng tin tưởng, sẵn sàng trả giá cao hơn 15-30%.
                </p>
              </div>
            </div>
            <div className="glass-card">
              <div className="card-header">
                <h3 className="card-title">
                  <span className="icon">🛡️</span>
                  Bảo vệ thương hiệu
                </h3>
              </div>
              <div className="card-body">
                <p style={{ lineHeight: '1.8' }}>
                  Nếu có sự cố về chất lượng, dễ dàng xác định nguồn gốc để xử lý, tránh ảnh hưởng toàn bộ mã số vùng trồng.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Contact */}
        <Footer />
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner-lg"></div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-lg)' }}>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Logged in - Dashboard
  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <span className="page-icon">🍈</span>
        <h1 className="page-title">Xin chào, {user.fullName || user.Username}!</h1>
        <p className="page-subtitle">Tổng quan hệ thống quản lý nông trại sầu riêng</p>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/qr" className="quick-action-btn">
          <span className="icon">🔲</span>
          <span>Tạo QR Code</span>
        </Link>
        <Link to="/trace" className="quick-action-btn">
          <span className="icon">🔍</span>
          <span>Truy xuất nguồn gốc</span>
        </Link>
        <Link to="/harvest-request" className="quick-action-btn">
          <span className="icon">📋</span>
          <span>Yêu cầu thu hoạch</span>
        </Link>
        <Link to="/warehouse" className="quick-action-btn">
          <span className="icon">🏭</span>
          <span>Quản lý kho</span>
        </Link>
        <Link to="/guide" className="quick-action-btn">
          <span className="icon">📖</span>
          <span>Hướng dẫn sử dụng</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🏡</div>
          <div className="stat-value">{stats.farms}</div>
          <div className="stat-label">Nông trại</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🌳</div>
          <div className="stat-value">{stats.trees}</div>
          <div className="stat-label">Cây sầu riêng</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-value">{stats.batches}</div>
          <div className="stat-label">Lô thu hoạch</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔲</div>
          <div className="stat-value">{stats.qrcodes}</div>
          <div className="stat-label">QR Code</div>
        </div>
      </div>

      {/* Farms Section */}
      <div className="section" id="farms">
        <div className="section-header">
          <h2 className="section-title">
            <span>🏡</span> Nông trại của bạn
          </h2>
          <button className="btn btn-primary">+ Thêm nông trại mới</button>
        </div>

        {farms.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🌱</div>
            <h3>Chưa có nông trại nào</h3>
            <p>Bắt đầu bằng cách thêm nông trại đầu tiên của bạn</p>
            <button className="btn btn-accent" style={{ marginTop: '1.5rem' }}>
              + Thêm nông trại
            </button>
          </div>
        ) : (
          <div className="content-grid">
            {farms.map((farm, index) => (
              <div
                key={farm.farmID}
                className="glass-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="icon">🏡</span>
                    {farm.farmName}
                  </h3>
                  <span className="card-badge badge-success">Hoạt động</span>
                </div>
                <div className="card-body">
                  <div className="card-row">
                    <span className="card-row-label">📍 Vị trí</span>
                    <span className="card-row-value">{farm.location || 'Chưa cập nhật'}</span>
                  </div>
                  <div className="card-row">
                    <span className="card-row-label">📐 Diện tích</span>
                    <span className="card-row-value">{farm.area ? `${farm.area} ha` : 'N/A'}</span>
                  </div>
                  <div className="card-row">
                    <span className="card-row-label">🌳 Số cây</span>
                    <span className="card-row-value">{farm.trees?.length || 0} cây</span>
                  </div>
                </div>
                <div className="card-footer">
                  <div className="btn-group">
                    <button className="btn btn-outline btn-sm">Xem chi tiết</button>
                    <button className="btn btn-secondary btn-sm">Chỉnh sửa</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Batches Section */}
      <div className="section" id="batches">
        <div className="section-header">
          <h2 className="section-title">
            <span>📦</span> Lô hàng gần đây
          </h2>
          <Link to="/qr" className="btn btn-primary">Quản lý QR Code</Link>
        </div>

        {recentBatches.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📦</div>
            <h3>Chưa có lô hàng nào</h3>
            <p>Các lô thu hoạch sẽ xuất hiện tại đây sau khi bạn tạo</p>
          </div>
        ) : (
          <div className="content-grid">
            {recentBatches.map((batch, index) => (
              <div
                key={batch.batchID}
                className="glass-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="icon">📦</span>
                    {batch.batchCode}
                  </h3>
                  <span className={`card-badge ${batch.isSafe ? 'badge-success' : 'badge-warning'}`}>
                    {batch.isSafe ? '✅ An toàn' : '⏳ Đang chờ'}
                  </span>
                </div>
                <div className="card-body">
                  <div className="card-row">
                    <span className="card-row-label">📊 Trạng thái</span>
                    <span className="card-row-value">{batch.status}</span>
                  </div>
                  <div className="card-row">
                    <span className="card-row-label">📅 Thu hoạch</span>
                    <span className="card-row-value">{formatDate(batch.actualHarvest)}</span>
                  </div>
                  <div className="card-row">
                    <span className="card-row-label">⚖️ Khối lượng</span>
                    <span className="card-row-value">{batch.quantity ? `${batch.quantity} kg` : 'N/A'}</span>
                  </div>
                </div>
                <div className="card-footer">
                  <div className="btn-group">
                    <Link to={`/trace/${batch.batchCode}`} className="btn btn-outline btn-sm">
                      🔍 Xem truy xuất
                    </Link>
                    <button className="btn btn-secondary btn-sm">🔲 Tạo QR</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer with Contact */}
      <Footer />
    </div>
  );
};

export default Dashboard;
