import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import QRScanner from '../components/QRScanner';
import SharedHeader, { SharedFooter } from '../components/SharedHeader';
import '../styles/shared-header.css';

const TracePage = () => {
  const { batchCode } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchCode, setSearchCode] = useState('');
  const [showScanner, setShowScanner] = useState(false);

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
    <div className="shared-page-layout">
      <SharedHeader
        title="Truy Xuất Nguồn Gốc"
        subtitle="DurianQR - Hệ thống truy xuất sầu riêng Việt Nam"
        bannerIcon="🍈"
        navType="public"
      />

      <div className="shared-page-body">
        <main className="shared-page-main">
          {/* Search Box */}
          <form onSubmit={handleSearch} style={styles.searchForm}>
            <input
              type="text"
              placeholder="Nhập mã lô hàng (VD: BATCH001)..."
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              style={styles.searchInput}
            />
            <button type="submit" style={styles.btnPrimary}>
              🔍 Tra cứu
            </button>
            <button
              type="button"
              style={styles.btnSecondary}
              onClick={() => setShowScanner(true)}
            >
              📷 Quét QR
            </button>
          </form>

          {/* QR Scanner Modal */}
          {showScanner && (
            <QRScanner
              onScanSuccess={(code) => {
                setShowScanner(false);
                setSearchCode(code);
                fetchTraceData(code);
              }}
              onClose={() => setShowScanner(false)}
            />
          )}

          {/* Loading State */}
          {loading && (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
              <p>Đang truy xuất thông tin...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div style={styles.emptyState}>
              <span style={styles.emptyIcon}>🔍</span>
              <h3>Không tìm thấy</h3>
              <p>{error}</p>
            </div>
          )}

          {/* Data Display */}
          {data && !loading && (
            <div style={styles.content}>
              {/* Safety Badge */}
              <div style={styles.safetyContainer}>
                <div style={{
                  ...styles.safetyBadge,
                  background: data.batch.isSafe ? '#e8f5e9' : '#ffebee',
                  borderColor: data.batch.isSafe ? '#4CAF50' : '#F44336',
                  color: data.batch.isSafe ? '#2e7d32' : '#c62828'
                }}>
                  {data.batch.safetyLabel}
                </div>
              </div>

              {/* Info Cards Grid */}
              <div style={styles.infoGrid}>
                {/* Batch Info */}
                <div style={styles.card}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>📦 Thông tin Lô hàng</h3>
                  </div>
                  <div style={styles.cardBody}>
                    <div style={styles.cardRow}>
                      <span>Mã lô hàng</span>
                      <span style={styles.highlight}>{data.batch.batchCode}</span>
                    </div>
                    <div style={styles.cardRow}>
                      <span>Trạng thái</span>
                      <span>{data.batch.status}</span>
                    </div>
                    <div style={styles.cardRow}>
                      <span>Ngày thu hoạch</span>
                      <span>{formatDate(data.batch.harvestDate)}</span>
                    </div>
                    <div style={styles.cardRow}>
                      <span>Khối lượng</span>
                      <span>{data.batch.quantity ? `${data.batch.quantity} kg` : 'N/A'}</span>
                    </div>
                    <div style={styles.cardRow}>
                      <span>Phân loại</span>
                      <span>{data.batch.qualityGrade || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Tree Info */}
                {data.tree && (
                  <div style={styles.card}>
                    <div style={styles.cardHeader}>
                      <h3 style={styles.cardTitle}>🌳 Thông tin Cây</h3>
                    </div>
                    <div style={styles.cardBody}>
                      <div style={styles.cardRow}>
                        <span>Mã cây</span>
                        <span>{data.tree.treeCode}</span>
                      </div>
                      <div style={styles.cardRow}>
                        <span>Giống sầu riêng</span>
                        <span style={styles.highlightYellow}>{data.tree.variety || 'N/A'}</span>
                      </div>
                      <div style={styles.cardRow}>
                        <span>Năm trồng</span>
                        <span>{data.tree.plantingYear || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Farm Info */}
                {data.farm && (
                  <div style={styles.card}>
                    <div style={styles.cardHeader}>
                      <h3 style={styles.cardTitle}>🏡 Thông tin Nông trại</h3>
                    </div>
                    <div style={styles.cardBody}>
                      <div style={styles.cardRow}>
                        <span>Tên nông trại</span>
                        <span>{data.farm.farmName}</span>
                      </div>
                      <div style={styles.cardRow}>
                        <span>Địa điểm</span>
                        <span>{data.farm.location || 'N/A'}</span>
                      </div>
                      <div style={styles.cardRow}>
                        <span>Diện tích</span>
                        <span>{data.farm.area ? `${data.farm.area} ha` : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Farmer Info */}
                {data.farmer && (
                  <div style={styles.card}>
                    <div style={styles.cardHeader}>
                      <h3 style={styles.cardTitle}>👨‍🌾 Nông dân</h3>
                    </div>
                    <div style={styles.cardBody}>
                      <div style={styles.cardRow}>
                        <span>Họ tên</span>
                        <span>{data.farmer.fullName}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Farming History Timeline */}
              {data.farmingHistory && data.farmingHistory.length > 0 && (
                <section style={styles.section}>
                  <h2 style={styles.sectionTitle}>📋 Lịch sử canh tác</h2>
                  <div style={styles.card}>
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
                </section>
              )}

              {/* QR Stats */}
              <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                  <span style={styles.statIcon}>👁️</span>
                  <span style={styles.statValue}>{data.qrStats.scanCount}</span>
                  <span style={styles.statLabel}>Lượt quét</span>
                </div>
                <div style={styles.statCard}>
                  <span style={styles.statIcon}>📅</span>
                  <span style={{ ...styles.statValue, fontSize: '1rem' }}>{formatDate(data.qrStats.generatedAt)}</span>
                  <span style={styles.statLabel}>Ngày tạo QR</span>
                </div>
              </div>

              {/* Footer */}
              <div style={styles.traceFooter}>
                <p>🍈 DurianQR - Hệ thống truy xuất nguồn gốc sầu riêng</p>
                <p>Truy xuất lúc: {formatDateTime(data.queriedAt)}</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!data && !loading && !error && !batchCode && (
            <div style={styles.emptyState}>
              <span style={styles.emptyIcon}>📱</span>
              <h3>Truy xuất nguồn gốc sầu riêng</h3>
              <p>Quét mã QR trên sản phẩm hoặc nhập mã lô hàng để xem thông tin chi tiết</p>
              <button
                style={styles.btnPrimary}
                onClick={() => setShowScanner(true)}
              >
                📷 Quét mã QR ngay
              </button>
            </div>
          )}

          {/* Back Link */}
          <div style={styles.backLink}>
            <Link to="/" style={styles.btnOutline}>
              ← Về trang chủ
            </Link>
          </div>
        </main>
      </div>

      <SharedFooter />
    </div>
  );
};

const styles = {
  searchForm: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  searchInput: {
    flex: 1,
    minWidth: '250px',
    padding: '0.75rem 1rem',
    background: '#ffffff',
    border: '1px solid #e5e5e5',
    borderRadius: '4px',
    color: '#1a1a1a',
    fontSize: '1rem',
  },
  btnPrimary: {
    padding: '0.75rem 1.5rem',
    background: '#2d5a27',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
  },
  btnSecondary: {
    padding: '0.75rem 1.5rem',
    background: '#fafafa',
    color: '#555',
    border: '1px solid #e5e5e5',
    borderRadius: '4px',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  btnOutline: {
    padding: '0.75rem 1.5rem',
    background: 'transparent',
    color: '#2d5a27',
    border: '1px solid #2d5a27',
    borderRadius: '4px',
    fontSize: '0.875rem',
    fontWeight: 600,
    textDecoration: 'none',
  },
  content: {},
  safetyContainer: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  safetyBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem 2rem',
    borderRadius: '50px',
    fontWeight: 700,
    fontSize: '1.1rem',
    border: '2px solid',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  card: {
    background: '#ffffff',
    border: '1px solid #e5e5e5',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  cardHeader: {
    padding: '1rem 1.25rem',
    borderBottom: '1px solid #f0f0f0',
    background: '#fafafa',
  },
  cardTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#1a1a1a',
    margin: 0,
  },
  cardBody: { padding: '1rem 1.25rem' },
  cardRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    fontSize: '0.9rem',
    color: '#555',
    borderBottom: '1px solid #f5f5f5',
  },
  highlight: {
    color: '#2d5a27',
    fontWeight: 700,
  },
  highlightYellow: {
    color: '#e65100',
    fontWeight: 600,
  },
  section: { marginBottom: '2rem' },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#1a1a1a',
    marginBottom: '1rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid #e5e5e5',
  },
  timeline: {
    position: 'relative',
    padding: '1.5rem',
    paddingLeft: '2.5rem',
  },
  timelineItem: {
    position: 'relative',
    paddingBottom: '1.5rem',
    paddingLeft: '1.5rem',
    borderLeft: '2px solid #c8e6c9',
  },
  timelineDot: {
    position: 'absolute',
    left: '-0.5rem',
    top: '0.25rem',
    width: '12px',
    height: '12px',
    background: '#4CAF50',
    borderRadius: '50%',
    border: '2px solid white',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  timelineContent: {
    paddingLeft: '0.5rem',
  },
  timelineDate: {
    fontSize: '0.8rem',
    color: '#888',
    marginBottom: '0.25rem',
  },
  timelineActivity: {
    fontWeight: 600,
    color: '#2d5a27',
    marginBottom: '0.25rem',
  },
  timelineDesc: {
    fontSize: '0.9rem',
    color: '#555',
  },
  chemicalBadge: {
    display: 'inline-block',
    background: '#fff3e0',
    color: '#e65100',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    marginTop: '0.5rem',
  },
  statsGrid: {
    display: 'flex',
    gap: '1.5rem',
    justifyContent: 'center',
    marginBottom: '2rem',
  },
  statCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1.5rem 2rem',
    background: '#ffffff',
    border: '1px solid #e5e5e5',
    borderRadius: '8px',
    textAlign: 'center',
  },
  statIcon: { fontSize: '2rem' },
  statValue: { fontSize: '2rem', fontWeight: 700, color: '#1a1a1a' },
  statLabel: { fontSize: '0.75rem', fontWeight: 600, color: '#888', textTransform: 'uppercase' },
  traceFooter: {
    textAlign: 'center',
    color: '#888',
    fontSize: '0.85rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    background: '#ffffff',
    border: '1px solid #e5e5e5',
    borderRadius: '8px',
    color: '#888',
    marginBottom: '2rem',
  },
  emptyIcon: { fontSize: '3rem', display: 'block', marginBottom: '1rem' },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem',
    color: '#888',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #e5e5e5',
    borderTop: '3px solid #2d5a27',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem',
  },
  backLink: {
    textAlign: 'center',
    marginTop: '2rem',
  },
};

export default TracePage;
