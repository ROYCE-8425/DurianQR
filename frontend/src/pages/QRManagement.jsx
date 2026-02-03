import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import SharedHeader, { SharedFooter } from '../components/SharedHeader';
import '../styles/shared-header.css';

const API_URL = 'http://localhost:5162';

const QRManagement = () => {
  const [batches, setBatches] = useState([]);
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedQR, setSelectedQR] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [batchesRes, qrRes] = await Promise.all([
        api.get('/batches'),
        api.get('/qr')
      ]);
      setBatches(batchesRes.data);
      setQrCodes(qrRes.data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Không thể tải dữ liệu' });
    } finally {
      setLoading(false);
    }
  };

  const generateQR = async (batchId) => {
    setGenerating(batchId);
    setMessage({ type: '', text: '' });

    try {
      await api.post(`/qr/generate/${batchId}`);
      setMessage({ type: 'success', text: '✅ Đã tạo QR code thành công!' });
      fetchData();
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Không thể tạo QR code'
      });
    } finally {
      setGenerating(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getQRForBatch = (batchId) => {
    return qrCodes.find(qr => qr.batchID === batchId);
  };

  const downloadQR = (batchCode, imagePath) => {
    const link = document.createElement('a');
    link.href = `${API_URL}${imagePath}`;
    link.download = `QR-${batchCode}.png`;
    link.click();
  };

  const batchesWithoutQR = batches.filter(b => !getQRForBatch(b.batchID));

  if (loading) {
    return (
      <div className="shared-page-layout">
        <SharedHeader
          title="Quản lý QR Code"
          subtitle="Đang tải dữ liệu..."
          bannerIcon="🔲"
          navType="public"
        />
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>Đang tải...</p>
        </div>
        <SharedFooter />
      </div>
    );
  }

  return (
    <div className="shared-page-layout">
      <SharedHeader
        title="Quản lý QR Code"
        subtitle="Tạo và quản lý mã QR cho các lô sầu riêng"
        bannerIcon="🔲"
        navType="public"
      />

      <div className="shared-page-body">
        <main className="shared-page-main">
          {/* Quick Actions */}
          <div style={styles.quickActions}>
            <Link to="/" style={styles.actionCard}>
              <span style={styles.actionIcon}>🏠</span>
              <span>Dashboard</span>
            </Link>
            <Link to="/trace" style={styles.actionCard}>
              <span style={styles.actionIcon}>🔍</span>
              <span>Truy xuất</span>
            </Link>
          </div>

          {/* Message */}
          {message.text && (
            <div style={message.type === 'success' ? styles.successMsg : styles.errorMsg}>
              {message.text}
            </div>
          )}

          {/* Stats */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <span style={styles.statIcon}>📦</span>
              <span style={styles.statValue}>{batchesWithoutQR.length}</span>
              <span style={styles.statLabel}>Chờ tạo QR</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statIcon}>✅</span>
              <span style={styles.statValue}>{qrCodes.length}</span>
              <span style={styles.statLabel}>QR đã tạo</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statIcon}>👁️</span>
              <span style={styles.statValue}>
                {qrCodes.reduce((sum, qr) => sum + (qr.scanCount || 0), 0)}
              </span>
              <span style={styles.statLabel}>Tổng lượt quét</span>
            </div>
          </div>

          {/* Batches without QR */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>📦 Lô hàng chưa có QR</h2>

            {batchesWithoutQR.length === 0 ? (
              <div style={styles.emptyState}>
                <span style={styles.emptyIcon}>✅</span>
                <h3>Tất cả đã có QR</h3>
                <p>Tất cả lô hàng đều đã được tạo QR code</p>
              </div>
            ) : (
              <div style={styles.cardsGrid}>
                {batchesWithoutQR.map((batch) => (
                  <div key={batch.batchID} style={styles.card}>
                    <div style={styles.cardHeader}>
                      <h3 style={styles.cardTitle}>📦 {batch.batchCode}</h3>
                      <span style={batch.isSafe ? styles.badgeSuccess : styles.badgeWarning}>
                        {batch.isSafe ? '✅ An toàn' : '⏳ Chờ PHI'}
                      </span>
                    </div>
                    <div style={styles.cardBody}>
                      <div style={styles.cardRow}>
                        <span>Trạng thái</span>
                        <span>{batch.status}</span>
                      </div>
                      <div style={styles.cardRow}>
                        <span>Thu hoạch</span>
                        <span>{formatDate(batch.actualHarvest)}</span>
                      </div>
                    </div>
                    <div style={styles.cardFooter}>
                      <button
                        style={batch.isSafe ? styles.btnPrimary : styles.btnDisabled}
                        onClick={() => generateQR(batch.batchID)}
                        disabled={generating === batch.batchID || !batch.isSafe}
                      >
                        {generating === batch.batchID ? 'Đang tạo...' : '🔲 Tạo QR Code'}
                      </button>
                      {!batch.isSafe && (
                        <p style={styles.warningText}>⚠️ Chưa qua thời gian cách ly</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Existing QR Codes */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>✅ QR Code đã tạo</h2>

            {qrCodes.length === 0 ? (
              <div style={styles.emptyState}>
                <span style={styles.emptyIcon}>🔲</span>
                <h3>Chưa có QR code</h3>
                <p>Tạo QR code cho lô hàng ở phần trên</p>
              </div>
            ) : (
              <div style={styles.cardsGrid}>
                {qrCodes.map((qr) => (
                  <div key={qr.qrid} style={styles.card}>
                    <div style={styles.cardHeader}>
                      <h3 style={styles.cardTitle}>🔲 {qr.batch?.batchCode || 'N/A'}</h3>
                      <span style={styles.badgeInfo}>👁️ {qr.scanCount} quét</span>
                    </div>

                    {/* QR Image */}
                    <div style={styles.qrImageContainer}>
                      <img
                        src={`${API_URL}${qr.qrImagePath}`}
                        alt="QR Code"
                        style={styles.qrImage}
                        onClick={() => setSelectedQR(qr)}
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </div>

                    <div style={styles.cardBody}>
                      <div style={styles.cardRow}>
                        <span>Tạo lúc</span>
                        <span>{formatDate(qr.generatedAt)}</span>
                      </div>
                    </div>

                    <div style={styles.cardFooter}>
                      <Link
                        to={`/trace/${qr.batch?.batchCode}`}
                        style={styles.btnOutline}
                      >
                        👁️ Xem
                      </Link>
                      <button
                        onClick={() => setSelectedQR(qr)}
                        style={styles.btnSecondary}
                      >
                        🔍 Phóng to
                      </button>
                      <button
                        onClick={() => downloadQR(qr.batch?.batchCode, qr.qrImagePath)}
                        style={styles.btnPrimary}
                      >
                        ⬇️ Tải về
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      {/* QR Modal */}
      {selectedQR && (
        <div style={styles.modal} onClick={() => setSelectedQR(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>🔲 {selectedQR.batch?.batchCode}</h3>
            <img
              src={`${API_URL}${selectedQR.qrImagePath}`}
              alt="QR Code"
              style={styles.modalImage}
            />
            <p style={styles.modalDesc}>Quét để truy xuất nguồn gốc sầu riêng</p>
            <div style={styles.modalButtons}>
              <button
                onClick={() => downloadQR(selectedQR.batch?.batchCode, selectedQR.qrImagePath)}
                style={styles.btnPrimary}
              >
                ⬇️ Tải về
              </button>
              <button
                onClick={() => setSelectedQR(null)}
                style={styles.btnOutline}
              >
                ✕ Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      <SharedFooter />
    </div>
  );
};

const styles = {
  quickActions: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
  },
  actionCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    background: '#ffffff',
    border: '1px solid #e5e5e5',
    borderRadius: '8px',
    textDecoration: 'none',
    color: '#1a1a1a',
    fontWeight: 600,
    fontSize: '0.875rem',
  },
  actionIcon: { fontSize: '1.25rem' },
  successMsg: {
    padding: '1rem',
    background: '#e8f5e9',
    border: '1px solid #c8e6c9',
    borderRadius: '8px',
    color: '#2e7d32',
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  errorMsg: {
    padding: '1rem',
    background: '#ffebee',
    border: '1px solid #ffcdd2',
    borderRadius: '8px',
    color: '#c62828',
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  statCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1.5rem',
    background: '#ffffff',
    border: '1px solid #e5e5e5',
    borderRadius: '8px',
    textAlign: 'center',
  },
  statIcon: { fontSize: '2rem' },
  statValue: { fontSize: '2rem', fontWeight: 700, color: '#1a1a1a' },
  statLabel: { fontSize: '0.75rem', fontWeight: 600, color: '#888', textTransform: 'uppercase' },
  section: { marginBottom: '2rem' },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#1a1a1a',
    marginBottom: '1rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid #e5e5e5',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    background: '#ffffff',
    border: '1px solid #e5e5e5',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.25rem',
    borderBottom: '1px solid #f0f0f0',
  },
  cardTitle: { fontSize: '1rem', fontWeight: 600, color: '#1a1a1a', margin: 0 },
  cardBody: { padding: '1rem 1.25rem' },
  cardRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    fontSize: '0.9rem',
    color: '#555',
  },
  cardFooter: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    padding: '1rem 1.25rem',
    borderTop: '1px solid #f0f0f0',
  },
  qrImageContainer: {
    textAlign: 'center',
    padding: '1.5rem',
    background: '#fafafa',
  },
  qrImage: {
    maxWidth: '160px',
    height: 'auto',
    cursor: 'pointer',
    borderRadius: '8px',
  },
  btnPrimary: {
    padding: '0.5rem 1rem',
    background: '#2d5a27',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
    textAlign: 'center',
  },
  btnOutline: {
    padding: '0.5rem 1rem',
    background: 'transparent',
    color: '#2d5a27',
    border: '1px solid #2d5a27',
    borderRadius: '4px',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
    textAlign: 'center',
  },
  btnSecondary: {
    padding: '0.5rem 1rem',
    background: '#fafafa',
    color: '#555',
    border: '1px solid #e5e5e5',
    borderRadius: '4px',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  btnDisabled: {
    padding: '0.5rem 1rem',
    background: '#e5e5e5',
    color: '#888',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'not-allowed',
  },
  badgeSuccess: {
    padding: '0.25rem 0.75rem',
    background: '#e8f5e9',
    color: '#2e7d32',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  badgeWarning: {
    padding: '0.25rem 0.75rem',
    background: '#fff3e0',
    color: '#e65100',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  badgeInfo: {
    padding: '0.25rem 0.75rem',
    background: '#e3f2fd',
    color: '#1565c0',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  warningText: {
    fontSize: '0.8rem',
    color: '#888',
    textAlign: 'center',
    margin: 0,
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    background: '#ffffff',
    border: '1px solid #e5e5e5',
    borderRadius: '8px',
    color: '#888',
  },
  emptyIcon: { fontSize: '3rem', display: 'block', marginBottom: '1rem' },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
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
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: 'white',
    padding: '2rem',
    borderRadius: '16px',
    textAlign: 'center',
    maxWidth: '90%',
    width: '400px',
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#2d5a27',
    marginBottom: '1rem',
  },
  modalImage: {
    maxWidth: '280px',
    width: '100%',
    borderRadius: '8px',
  },
  modalDesc: {
    color: '#888',
    fontSize: '0.9rem',
    margin: '1rem 0',
  },
  modalButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginTop: '1rem',
  },
};

export default QRManagement;
