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
    // Demo data for landing page stats can be mocked or fetched similarly
    setLoading(false); 
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // CLEAN FOOTER
  const Footer = () => (
    <footer className="footer" style={{ borderTop: '1px solid var(--color-border)', marginTop: '4rem', padding: '3rem 0', background: 'white' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>DurianQR</h3>
            <p className="text-muted">Minh bạch nông sản Việt - Nâng tầm giá trị sầu riêng.</p>
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Liên hệ</h4>
            <ul style={{ listStyle: 'none', padding: 0, color: 'var(--color-text-secondary)' }}>
              <li className="mb-2">📍 HUTECH, TP.HCM</li>
              <li className="mb-2">📞 1900 xxxx</li>
              <li>✉️ support@durianqr.vn</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-muted" style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
          <small>© 2026 DurianQR. All rights reserved.</small>
        </div>
      </div>
    </footer>
  );

  // LANDING PAGE (Not Logged In)
  if (!user) {
    return (
      <div className="landing-page">
        {/* Hero */}
        <div style={{ background: 'white', padding: '6rem 0', textAlign: 'center' }}>
          <div className="container">
            <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: 'var(--color-text-main)' }}>
              Truy xuất nguồn gốc <span className="text-primary">Sầu Riêng</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
              Giải pháp công nghệ minh bạch hành trình từ nông trại đến bàn ăn. 
              Bảo vệ thương hiệu, nâng cao niềm tin người tiêu dùng.
            </p>
            <div className="flex gap-4" style={{ justifyContent: 'center' }}>
              <Link to="/trace" className="btn btn-primary btn-lg">🔍 Truy xuất ngay</Link>
              <Link to="/login" className="btn btn-secondary btn-lg">🔐 Đăng nhập</Link>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div style={{ background: 'var(--color-primary)', padding: '3rem 0', color: 'white' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>100%</div>
                <div style={{ opacity: 0.9 }}>Minh bạch</div>
              </div>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>24/7</div>
                <div style={{ opacity: 0.9 }}>Giám sát</div>
              </div>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>VietGAP</div>
                <div style={{ opacity: 0.9 }}>Tiêu chuẩn</div>
              </div>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>500+</div>
                <div style={{ opacity: 0.9 }}>Nông hộ</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div style={{ padding: '5rem 0' }}>
          <div className="container">
            <div className="text-center mb-4">
              <h2 className="section-title" style={{ justifyContent: 'center' }}>Tính năng nổi bật</h2>
              <p className="text-muted">Công nghệ hỗ trợ toàn diện cho nông dân và doanh nghiệp</p>
            </div>
            
            <div className="content-grid">
              <div className="card text-center">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
                <h3 className="card-title mb-2">Nhật ký điện tử</h3>
                <p className="text-muted">Ghi chép quy trình canh tác dễ dàng trên điện thoại. Tự động cảnh báo cách ly an toàn.</p>
              </div>
              <div className="card text-center">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏭</div>
                <h3 className="card-title mb-2">Quản lý kho</h3>
                <p className="text-muted">Theo dõi tồn kho, nhập xuất lô hàng chính xác. Tối ưu hóa vận hành.</p>
              </div>
              <div className="card text-center">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔲</div>
                <h3 className="card-title mb-2">QR Code thông minh</h3>
                <p className="text-muted">Mỗi trái sầu riêng một mã định danh duy nhất. Chống giả mạo tuyệt đối.</p>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // LOGGED IN DASHBOARD
  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      {/* Header */}
      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="page-title">Xin chào, {user.fullName || user.Username}! 👋</h1>
          <p className="page-subtitle">Hôm nay bạn muốn làm gì?</p>
        </div>
        <div className="text-muted">{new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        <Link to="/qr" className="card hover-lift" style={{ textDecoration: 'none', textAlign: 'center', background: 'white' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔲</div>
          <div style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>Tạo QR Code</div>
        </Link>
        <Link to="/trace" className="card hover-lift" style={{ textDecoration: 'none', textAlign: 'center', background: 'white' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
          <div style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>Truy xuất</div>
        </Link>
        <Link to="/harvest-request" className="card hover-lift" style={{ textDecoration: 'none', textAlign: 'center', background: 'white' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
          <div style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>Yêu cầu thu hoạch</div>
        </Link>
        <Link to="/guide" className="card hover-lift" style={{ textDecoration: 'none', textAlign: 'center', background: 'white' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📖</div>
          <div style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>Hướng dẫn</div>
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-row mb-4">
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Nông trại</span>
            <span className="stat-value">{stats.farms}</span>
          </div>
          <div className="stat-icon">🏡</div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Cây sầu riêng</span>
            <span className="stat-value">{stats.trees}</span>
          </div>
          <div className="stat-icon">🌳</div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Lô thu hoạch</span>
            <span className="stat-value">{stats.batches}</span>
          </div>
          <div className="stat-icon">📦</div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Mã QR</span>
            <span className="stat-value">{stats.qrcodes}</span>
          </div>
          <div className="stat-icon">🔲</div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <h2 className="section-title mb-3">Hoạt động gần đây</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Batches Column */}
        <div>
          {recentBatches.length === 0 ? (
             <div className="card text-center p-5">
               <div className="text-muted mb-3">Chưa có lô hàng nào</div>
               <Link to="/harvest-request" className="btn btn-primary btn-sm">Tạo yêu cầu ngay</Link>
             </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recentBatches.map(batch => (
                <div key={batch.batchID} className="card flex justify-between items-center p-3">
                  <div className="flex gap-3 items-center">
                    <div style={{ background: '#EFF6FF', padding: '0.5rem', borderRadius: '8px' }}>📦</div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{batch.batchCode}</div>
                      <div className="text-muted" style={{ fontSize: '0.85rem' }}>{formatDate(batch.actualHarvest)}</div>
                    </div>
                  </div>
                  <div>
                    <span className={`badge ${batch.isSafe ? 'badge-success' : 'badge-warning'}`}>
                      {batch.isSafe ? 'An toàn' : 'Chờ duyệt'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Tips / Notifications */}
        <div className="card">
          <h3 className="card-title mb-3">🔔 Thông báo</h3>
          <ul style={{ paddingLeft: '1.2rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            <li className="mb-2">Nhớ cập nhật nhật ký canh tác sau mỗi lần phun thuốc.</li>
            <li className="mb-2">Kiểm tra thời gian cách ly trước khi gửi yêu cầu thu hoạch.</li>
            <li>Cập nhật thông tin nông trại đầy đủ để tăng độ uy tín.</li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
