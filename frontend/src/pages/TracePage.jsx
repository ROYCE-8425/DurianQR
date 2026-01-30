import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/global.css';

const TracePage = () => {
  const { batchCode } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchCode, setSearchCode] = useState('');

  useEffect(() => {
    if (batchCode) {
      fetchTraceData(batchCode);
    }
  }, [batchCode]);

  const fetchTraceData = async (code) => {
    setLoading(true);
    setError('');
    setData(null);
    
    try {
      const response = await api.get(`/trace/${code}`);
      setData(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Không tìm thấy lô hàng với mã này');
      } else {
        setError('Đã xảy ra lỗi khi truy xuất thông tin');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCode.trim()) {
      fetchTraceData(searchCode.trim());
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <span className="page-icon">🍈</span>
        <h1 className="page-title">Truy Xuất Nguồn Gốc</h1>
        <p className="page-subtitle">DurianQR - Hệ thống truy xuất sầu riêng Việt Nam</p>
      </div>

      {/* Search Box */}
      <form onSubmit={handleSearch} style={styles.searchForm}>
        <input
          type="text"
          placeholder="Nhập mã lô hàng (VD: BATCH001)..."
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          style={styles.searchInput}
        />
        <button type="submit" className="btn btn-primary">
          🔍 Tra cứu
        </button>
      </form>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="spinner-lg"></div>
          <p style={{ color: 'var(--text-secondary)' }}>Đang truy xuất thông tin...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="empty-state">
          <div className="icon">🔍</div>
          <h3>Không tìm thấy</h3>
          <p>{error}</p>
        </div>
      )}

      {/* Data Display */}
      {data && !loading && (
        <div style={styles.content}>
          {/* Safety Badge */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              ...styles.safetyBadge,
              background: data.batch.isSafe 
                ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(129, 199, 132, 0.1))'
                : 'linear-gradient(135deg, rgba(244, 67, 54, 0.2), rgba(239, 83, 80, 0.1))',
              borderColor: data.batch.isSafe ? '#4CAF50' : '#F44336',
              color: data.batch.isSafe ? '#81C784' : '#EF5350'
            }}>
              {data.batch.safetyLabel}
            </div>
          </div>

          {/* Info Cards Grid */}
          <div className="content-grid" style={{ maxWidth: 900, margin: '0 auto' }}>
            {/* Batch Info */}
            <div className="glass-card">
              <div className="card-header">
                <h3 className="card-title">
                  <span className="icon">📦</span>
                  Thông tin Lô hàng
                </h3>
              </div>
              <div className="card-body">
                <div className="card-row">
                  <span className="card-row-label">Mã lô hàng</span>
                  <span className="card-row-value" style={{ color: '#81C784', fontWeight: 700 }}>
                    {data.batch.batchCode}
                  </span>
                </div>
                <div className="card-row">
                  <span className="card-row-label">Trạng thái</span>
                  <span className="card-row-value">{data.batch.status}</span>
                </div>
                <div className="card-row">
                  <span className="card-row-label">Ngày thu hoạch</span>
                  <span className="card-row-value">{formatDate(data.batch.harvestDate)}</span>
                </div>
                <div className="card-row">
                  <span className="card-row-label">Khối lượng</span>
                  <span className="card-row-value">{data.batch.quantity ? `${data.batch.quantity} kg` : 'N/A'}</span>
                </div>
                <div className="card-row">
                  <span className="card-row-label">Phân loại</span>
                  <span className="card-row-value">{data.batch.qualityGrade || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Tree Info */}
            {data.tree && (
              <div className="glass-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="icon">🌳</span>
                    Thông tin Cây
                  </h3>
                </div>
                <div className="card-body">
                  <div className="card-row">
                    <span className="card-row-label">Mã cây</span>
                    <span className="card-row-value">{data.tree.treeCode}</span>
                  </div>
                  <div className="card-row">
                    <span className="card-row-label">Giống sầu riêng</span>
                    <span className="card-row-value" style={{ color: '#FFD54F' }}>
                      {data.tree.variety || 'N/A'}
                    </span>
                  </div>
                  <div className="card-row">
                    <span className="card-row-label">Năm trồng</span>
                    <span className="card-row-value">{data.tree.plantingYear || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Farm Info */}
            {data.farm && (
              <div className="glass-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="icon">🏡</span>
                    Thông tin Nông trại
                  </h3>
                </div>
                <div className="card-body">
                  <div className="card-row">
                    <span className="card-row-label">Tên nông trại</span>
                    <span className="card-row-value">{data.farm.farmName}</span>
                  </div>
                  <div className="card-row">
                    <span className="card-row-label">Địa điểm</span>
                    <span className="card-row-value">{data.farm.location || 'N/A'}</span>
                  </div>
                  <div className="card-row">
                    <span className="card-row-label">Diện tích</span>
                    <span className="card-row-value">{data.farm.area ? `${data.farm.area} ha` : 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Farmer Info */}
            {data.farmer && (
              <div className="glass-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="icon">👨‍🌾</span>
                    Nông dân
                  </h3>
                </div>
                <div className="card-body">
                  <div className="card-row">
                    <span className="card-row-label">Họ tên</span>
                    <span className="card-row-value">{data.farmer.fullName}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Farming History Timeline */}
          {data.farmingHistory && data.farmingHistory.length > 0 && (
            <div className="section" style={{ maxWidth: 900, margin: '2rem auto 0' }}>
              <div className="section-header">
                <h2 className="section-title">
                  <span>📋</span> Lịch sử canh tác
                </h2>
              </div>
              <div className="glass-card">
                <div style={styles.timeline}>
                  {data.farmingHistory.map((log, index) => (
                    <div key={index} style={styles.timelineItem}>
                      <div style={styles.timelineDot}></div>
                      <div style={styles.timelineContent}>
                        <div style={styles.timelineDate}>{formatDateTime(log.date)}</div>
                        <div style={styles.timelineActivity}>{log.activity}</div>
                        {log.description && (
                          <div style={styles.timelineDesc}>{log.description}</div>
                        )}
                        {log.chemical && (
                          <span style={styles.chemicalBadge}>
                            💊 {log.chemical} {log.dosage && `- ${log.dosage}`}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* QR Stats */}
          <div className="stats-grid" style={{ maxWidth: 400, margin: '2rem auto' }}>
            <div className="stat-card">
              <div className="stat-icon">👁️</div>
              <div className="stat-value">{data.qrStats.scanCount}</div>
              <div className="stat-label">Lượt quét</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-value" style={{ fontSize: '1rem' }}>{formatDate(data.qrStats.generatedAt)}</div>
              <div className="stat-label">Ngày tạo QR</div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <p>🍈 DurianQR - Hệ thống truy xuất nguồn gốc sầu riêng</p>
            <p>Truy xuất lúc: {formatDateTime(data.queriedAt)}</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!data && !loading && !error && !batchCode && (
        <div className="empty-state">
          <div className="icon">📱</div>
          <h3>Quét mã QR hoặc nhập mã lô hàng</h3>
          <p>Nhập mã lô hàng vào ô tìm kiếm ở trên để xem thông tin sản phẩm</p>
        </div>
      )}

      {/* Back Link */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link to="/" className="btn btn-secondary">
          ← Về trang chủ
        </Link>
      </div>
    </div>
  );
};

const styles = {
  searchForm: {
    display: 'flex',
    gap: '0.75rem',
    maxWidth: '500px',
    margin: '0 auto 2rem'
  },
  searchInput: {
    flex: 1,
    padding: '1rem 1.5rem',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '1rem',
    outline: 'none'
  },
  content: {
    animation: 'fadeInUp 0.5s ease'
  },
  safetyBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem 2rem',
    borderRadius: '50px',
    fontWeight: 700,
    fontSize: '1.2rem',
    border: '2px solid'
  },
  timeline: {
    position: 'relative',
    paddingLeft: '2rem'
  },
  timelineItem: {
    position: 'relative',
    paddingBottom: '1.5rem',
    paddingLeft: '1.5rem',
    borderLeft: '2px solid rgba(76, 175, 80, 0.3)'
  },
  timelineDot: {
    position: 'absolute',
    left: '-0.5rem',
    top: '0.25rem',
    width: '12px',
    height: '12px',
    background: '#4CAF50',
    borderRadius: '50%',
    border: '2px solid #1a2f1a'
  },
  timelineContent: {
    paddingLeft: '0.5rem'
  },
  timelineDate: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginBottom: '0.25rem'
  },
  timelineActivity: {
    fontWeight: 600,
    color: '#81C784',
    marginBottom: '0.25rem'
  },
  timelineDesc: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)'
  },
  chemicalBadge: {
    display: 'inline-block',
    background: 'rgba(255, 193, 7, 0.2)',
    color: '#FFD54F',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    marginTop: '0.5rem'
  }
};

export default TracePage;
