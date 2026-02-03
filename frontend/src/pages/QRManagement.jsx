import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/global.css';

const API_URL = 'http://localhost:5162';

const QRManagement = () => {
  const [batches, setBatches] = useState([]);
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedQR, setSelectedQR] = useState(null); // Modal state
  const [previewBatch, setPreviewBatch] = useState(null); // Preview before generate

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
      const response = await api.post(`/qr/generate/${batchId}`);
      setMessage({ 
        type: 'success', 
        text: `✅ Đã tạo QR code thành công!` 
      });
      setPreviewBatch(null);
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
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner-lg"></div>
          <p style={{ color: 'var(--color-text-secondary)' }}>Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <span className="page-icon">🔲</span>
        <h1 className="page-title">Quản lý QR Code</h1>
        <p className="page-subtitle">Tạo và quản lý mã QR cho các lô sầu riêng</p>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/" className="quick-action-btn">
          <span className="icon">🏠</span>
          <span>Dashboard</span>
        </Link>
        <Link to="/trace" className="quick-action-btn">
          <span className="icon">🔍</span>
          <span>Truy xuất</span>
        </Link>
      </div>

      {/* Message */}
      {message.text && (
        <div style={{ 
          maxWidth: 800, 
          margin: '0 auto 1.5rem',
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          background: message.type === 'success' 
            ? 'rgba(76, 175, 80, 0.15)' 
            : 'rgba(244, 67, 54, 0.15)',
          border: `1px solid ${message.type === 'success' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'}`,
          color: message.type === 'success' ? '#81C784' : '#EF5350',
          textAlign: 'center'
        }}>
          {message.text}
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid" style={{ maxWidth: 600 }}>
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-value">{batchesWithoutQR.length}</div>
          <div className="stat-label">Chờ tạo QR</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{qrCodes.length}</div>
          <div className="stat-label">QR đã tạo</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👁️</div>
          <div className="stat-value">
            {qrCodes.reduce((sum, qr) => sum + (qr.scanCount || 0), 0)}
          </div>
          <div className="stat-label">Tổng lượt quét</div>
        </div>
      </div>

      {/* Batches without QR */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">
            <span>📦</span> Lô hàng chưa có QR
          </h2>
        </div>
        
        {batchesWithoutQR.length === 0 ? (
          <div className="empty-state">
            <div className="icon">✅</div>
            <h3>Tất cả đã có QR</h3>
            <p>Tất cả lô hàng đều đã được tạo QR code</p>
          </div>
        ) : (
          <div className="content-grid">
            {batchesWithoutQR.map((batch, index) => (
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
                    {batch.isSafe ? '✅ An toàn' : '⏳ Chờ PHI'}
                  </span>
                </div>
                <div className="card-body">
                  <div className="card-row">
                    <span className="card-row-label">Trạng thái</span>
                    <span className="card-row-value">{batch.status}</span>
                  </div>
                  <div className="card-row">
                    <span className="card-row-label">Thu hoạch</span>
                    <span className="card-row-value">{formatDate(batch.actualHarvest)}</span>
                  </div>
                </div>
                <div className="card-footer">
                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => generateQR(batch.batchID)}
                    disabled={generating === batch.batchID || !batch.isSafe}
                    style={{ opacity: !batch.isSafe ? 0.5 : 1 }}
                  >
                    {generating === batch.batchID ? (
                      <>
                        <span className="spinner-lg" style={{ 
                          width: 18, height: 18, borderWidth: 2, marginRight: 8 
                        }}></span>
                        Đang tạo...
                      </>
                    ) : (
                      '🔲 Tạo QR Code'
                    )}
                  </button>
                  {!batch.isSafe && (
                    <p style={{ 
                      fontSize: '0.8rem', 
                      color: 'var(--text-muted)', 
                      marginTop: '0.5rem', 
                      textAlign: 'center' 
                    }}>
                      ⚠️ Chưa qua thời gian cách ly
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Existing QR Codes */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">
            <span>✅</span> QR Code đã tạo
          </h2>
        </div>
        
        {qrCodes.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔲</div>
            <h3>Chưa có QR code</h3>
            <p>Tạo QR code cho lô hàng ở phần trên</p>
          </div>
        ) : (
          <div className="content-grid">
            {qrCodes.map((qr, index) => (
              <div 
                key={qr.qrid} 
                className="glass-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="icon">🔲</span>
                    {qr.batch?.batchCode || 'N/A'}
                  </h3>
                  <span className="card-badge badge-info">
                    👁️ {qr.scanCount} quét
                  </span>
                </div>
                
                {/* QR Image */}
                <div style={{ 
                  textAlign: 'center', 
                  margin: '1rem 0',
                  padding: '1.5rem',
                  background: 'white',
                  borderRadius: '16px'
                }}>
                  <img 
                    src={`${API_URL}${qr.qrImagePath}`}
                    alt="QR Code"
                    style={{ maxWidth: '160px', height: 'auto', cursor: 'pointer' }}
                    onClick={() => setSelectedQR(qr)}
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>

                <div className="card-body">
                  <div className="card-row">
                    <span className="card-row-label">Tạo lúc</span>
                    <span className="card-row-value">{formatDate(qr.generatedAt)}</span>
                  </div>
                </div>

                <div className="card-footer">
                  <div className="btn-group">
                    <Link 
                      to={`/trace/${qr.batch?.batchCode}`}
                      className="btn btn-outline btn-sm"
                      style={{ flex: 1, textAlign: 'center' }}
                    >
                      👁️ Xem
                    </Link>
                    <button
                      onClick={() => setSelectedQR(qr)}
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1 }}
                    >
                      🔍 Phóng to
                    </button>
                    <button
                      onClick={() => downloadQR(qr.batch?.batchCode, qr.qrImagePath)}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                    >
                      ⬇️ Tải về
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QR Modal */}
      {selectedQR && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(10px)'
          }}
          onClick={() => setSelectedQR(null)}
        >
          <div 
            style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '24px',
              textAlign: 'center',
              maxWidth: '90%',
              animation: 'fadeIn 0.3s ease'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: '1rem', color: '#1B5E20' }}>
              🔲 {selectedQR.batch?.batchCode}
            </h3>
            <img 
              src={`${API_URL}${selectedQR.qrImagePath}`}
              alt="QR Code"
              style={{ maxWidth: '300px', width: '100%' }}
            />
            <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
              Quét để truy xuất nguồn gốc sầu riêng
            </p>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={() => downloadQR(selectedQR.batch?.batchCode, selectedQR.qrImagePath)}
                className="btn btn-primary"
              >
                ⬇️ Tải về
              </button>
              <button 
                onClick={() => setSelectedQR(null)}
                className="btn btn-outline"
              >
                ✕ Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRManagement;
