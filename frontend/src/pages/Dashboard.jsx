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

  // Not logged in
  if (!user) {
    return (
      <div className="page-container">
        <div className="page-header">
          <span className="page-icon">🍈</span>
          <h1 className="page-title">DurianQR</h1>
          <p className="page-subtitle">Hệ thống truy xuất nguồn gốc sầu riêng</p>
        </div>
        
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
            <span>Truy xuất</span>
          </Link>
        </div>
        
        <div className="empty-state">
          <div className="icon">🌱</div>
          <h3>Chào mừng đến với DurianQR</h3>
          <p>Đăng nhập để quản lý nông trại và tạo QR code cho sản phẩm</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner-lg"></div>
          <p style={{ color: 'var(--text-secondary)' }}>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

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
          <span>Truy xuất</span>
        </Link>
        <a href="#farms" className="quick-action-btn">
          <span className="icon">🏡</span>
          <span>Nông trại</span>
        </a>
        <a href="#batches" className="quick-action-btn">
          <span className="icon">📦</span>
          <span>Lô hàng</span>
        </a>
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
          <button className="btn btn-primary btn-sm">+ Thêm mới</button>
        </div>
        
        {farms.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🌱</div>
            <h3>Chưa có nông trại</h3>
            <p>Bắt đầu bằng cách thêm nông trại đầu tiên</p>
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
          <Link to="/qr" className="btn btn-primary btn-sm">Quản lý QR</Link>
        </div>
        
        {recentBatches.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📦</div>
            <h3>Chưa có lô hàng</h3>
            <p>Các lô thu hoạch sẽ xuất hiện tại đây</p>
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
                    {batch.isSafe ? '✅ An toàn' : '⏳ Chờ'}
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
                      🔍 Xem
                    </Link>
                    <button className="btn btn-secondary btn-sm">🔲 Tạo QR</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
