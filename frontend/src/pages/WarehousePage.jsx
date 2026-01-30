import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/global.css';

const WarehousePage = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('pending'); // pending, batching, batches
  const [batches, setBatches] = useState([]);
  
  const [checkInData, setCheckInData] = useState({
    requestId: null,
    actualQuantity: '',
    gradeA: '',
    gradeB: '',
    gradeC: ''
  });

  const [batchData, setBatchData] = useState({
    qualityGrade: 'Premium',
    targetMarket: 'China',
    notes: ''
  });

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pendingRes, completedRes, batchesRes] = await Promise.all([
        api.get('/harvest-requests/pending'),
        api.get('/harvest-requests/completed'),
        api.get('/batches')
      ]);
      setPendingRequests(pendingRes.data);
      setCompletedRequests(completedRes.data);
      setBatches(batchesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (request) => {
    setCheckInData({
      requestId: request.requestID,
      actualQuantity: request.estimatedQuantity || '',
      gradeA: '',
      gradeB: '',
      gradeC: ''
    });
  };

  const submitCheckIn = async () => {
    if (!checkInData.actualQuantity) {
      setMessage({ type: 'error', text: 'Vui lòng nhập số lượng thực tế' });
      return;
    }

    try {
      await api.put(`/harvest-requests/${checkInData.requestId}/checkin`, {
        warehouseManagerId: user?.UserID || 0,
        actualQuantity: parseFloat(checkInData.actualQuantity),
        gradeA: parseFloat(checkInData.gradeA) || 0,
        gradeB: parseFloat(checkInData.gradeB) || 0,
        gradeC: parseFloat(checkInData.gradeC) || 0
      });

      // Complete immediately after check-in
      await api.put(`/harvest-requests/${checkInData.requestId}/complete`);

      setMessage({ type: 'success', text: '✅ Nhập kho thành công!' });
      setCheckInData({ requestId: null, actualQuantity: '', gradeA: '', gradeB: '', gradeC: '' });
      fetchData();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Lỗi khi nhập kho' });
    }
  };

  const toggleSelectRequest = (requestId) => {
    setSelectedRequests(prev => 
      prev.includes(requestId)
        ? prev.filter(id => id !== requestId)
        : [...prev, requestId]
    );
  };

  const createBatch = async () => {
    if (selectedRequests.length === 0) {
      setMessage({ type: 'error', text: 'Vui lòng chọn ít nhất 1 sản phẩm' });
      return;
    }

    try {
      const response = await api.post('/batches/create', {
        harvestRequestIds: selectedRequests,
        warehouseId: 1, // Default warehouse
        qualityGrade: batchData.qualityGrade,
        targetMarket: batchData.targetMarket,
        notes: batchData.notes,
        createdBy: user?.UserID
      });

      setMessage({ type: 'success', text: response.data.message });
      setSelectedRequests([]);
      fetchData();
      setActiveTab('batches');
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Lỗi khi tạo lô' });
    }
  };

  const generateQR = async (batchId) => {
    try {
      const response = await api.post(`/qr/generate/${batchId}`);
      setMessage({ type: 'success', text: `✅ Đã tạo QR code! URL: ${response.data.traceUrl}` });
      fetchData();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Lỗi khi tạo QR' });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (!user || user.Role === 'Farmer') {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="icon">🔐</div>
          <h3>Không có quyền truy cập</h3>
          <p>Trang này dành cho Thủ kho / Admin</p>
          <Link to="/" className="btn btn-primary">Về Dashboard</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner-lg"></div>
          <p style={{ color: 'var(--text-secondary)' }}>Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <span className="page-icon">📦</span>
        <h1 className="page-title">Quản lý Kho</h1>
        <p className="page-subtitle">Nhập kho, phân loại và tạo lô xuất khẩu</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📥</div>
          <div className="stat-value">{pendingRequests.length}</div>
          <div className="stat-label">Chờ nhập kho</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{completedRequests.length}</div>
          <div className="stat-label">Đã nhập kho</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-value">{batches.length}</div>
          <div className="stat-label">Lô hàng</div>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div style={{ 
          maxWidth: 800, 
          margin: '0 auto 1.5rem',
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          background: message.type === 'success' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(244, 67, 54, 0.15)',
          border: `1px solid ${message.type === 'success' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'}`,
          color: message.type === 'success' ? '#81C784' : '#EF5350',
          textAlign: 'center'
        }}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div style={styles.tabs}>
        <button 
          className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
          style={activeTab === 'pending' ? styles.tabActive : styles.tab}
        >
          📥 Nhập kho ({pendingRequests.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'batching' ? 'active' : ''}`}
          onClick={() => setActiveTab('batching')}
          style={activeTab === 'batching' ? styles.tabActive : styles.tab}
        >
          🔲 Tạo lô ({completedRequests.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'batches' ? 'active' : ''}`}
          onClick={() => setActiveTab('batches')}
          style={activeTab === 'batches' ? styles.tabActive : styles.tab}
        >
          📦 Lô hàng ({batches.length})
        </button>
      </div>

      {/* Tab Content */}
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* Pending Tab - Nhập kho */}
        {activeTab === 'pending' && (
          <div className="glass-card">
            <div className="card-header">
              <h3 className="card-title">
                <span className="icon">📥</span>
                Danh sách chờ nhập kho
              </h3>
            </div>
            
            {pendingRequests.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <div className="icon">📭</div>
                <h3>Không có yêu cầu chờ</h3>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th>Mã phiếu</th>
                      <th>Nông dân</th>
                      <th>Cây</th>
                      <th>Ngày cắt</th>
                      <th>Ước tính</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRequests.map(request => (
                      <tr key={request.requestID}>
                        <td><strong style={{ color: '#81C784' }}>{request.requestCode}</strong></td>
                        <td>{request.farmer?.fullName || 'N/A'}</td>
                        <td>{request.tree?.treeCode}</td>
                        <td>{formatDate(request.expectedHarvestDate)}</td>
                        <td>{request.estimatedQuantity} kg</td>
                        <td>
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => handleCheckIn(request)}
                          >
                            📥 Nhập kho
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Check-in Modal */}
            {checkInData.requestId && (
              <div style={styles.modal}>
                <div style={styles.modalContent}>
                  <h3 style={{ marginBottom: '1rem', color: 'white' }}>📥 Nhập kho</h3>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={styles.label}>Tổng số lượng thực tế (kg)</label>
                    <input 
                      type="number"
                      value={checkInData.actualQuantity}
                      onChange={(e) => setCheckInData(prev => ({ ...prev, actualQuantity: e.target.value }))}
                      style={styles.input}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={styles.label}>Loại A (kg)</label>
                      <input 
                        type="number"
                        placeholder="Xuất khẩu"
                        value={checkInData.gradeA}
                        onChange={(e) => setCheckInData(prev => ({ ...prev, gradeA: e.target.value }))}
                        style={styles.input}
                      />
                    </div>
                    <div>
                      <label style={styles.label}>Loại B (kg)</label>
                      <input 
                        type="number"
                        placeholder="Chế biến"
                        value={checkInData.gradeB}
                        onChange={(e) => setCheckInData(prev => ({ ...prev, gradeB: e.target.value }))}
                        style={styles.input}
                      />
                    </div>
                    <div>
                      <label style={styles.label}>Loại C (kg)</label>
                      <input 
                        type="number"
                        placeholder="Dạt"
                        value={checkInData.gradeC}
                        onChange={(e) => setCheckInData(prev => ({ ...prev, gradeC: e.target.value }))}
                        style={styles.input}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-primary" onClick={submitCheckIn}>
                      ✅ Xác nhận nhập kho
                    </button>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => setCheckInData({ requestId: null, actualQuantity: '', gradeA: '', gradeB: '', gradeC: '' })}
                    >
                      ❌ Hủy
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Batching Tab - Tạo lô */}
        {activeTab === 'batching' && (
          <div className="glass-card">
            <div className="card-header">
              <h3 className="card-title">
                <span className="icon">🔲</span>
                Tạo lô xuất khẩu
              </h3>
              <span className="card-badge badge-info">
                Đã chọn: {selectedRequests.length}
              </span>
            </div>
            
            {completedRequests.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <div className="icon">📭</div>
                <h3>Chưa có sản phẩm trong kho</h3>
                <p>Vui lòng nhập kho sản phẩm trước</p>
              </div>
            ) : (
              <>
                <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th>Chọn</th>
                        <th>Mã phiếu</th>
                        <th>Nông dân</th>
                        <th>Loại A</th>
                        <th>Loại B</th>
                        <th>Loại C</th>
                        <th>Tổng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedRequests.map(request => (
                        <tr key={request.requestID}>
                          <td>
                            <input 
                              type="checkbox"
                              checked={selectedRequests.includes(request.requestID)}
                              onChange={() => toggleSelectRequest(request.requestID)}
                              style={{ width: '20px', height: '20px' }}
                            />
                          </td>
                          <td><strong style={{ color: '#81C784' }}>{request.requestCode}</strong></td>
                          <td>{request.farmer?.fullName || 'N/A'}</td>
                          <td>{request.gradeA_Quantity || 0} kg</td>
                          <td>{request.gradeB_Quantity || 0} kg</td>
                          <td>{request.gradeC_Quantity || 0} kg</td>
                          <td><strong>{request.actualQuantity || 0} kg</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {selectedRequests.length > 0 && (
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label style={styles.label}>Phân loại</label>
                        <select 
                          value={batchData.qualityGrade}
                          onChange={(e) => setBatchData(prev => ({ ...prev, qualityGrade: e.target.value }))}
                          style={styles.input}
                        >
                          <option value="Premium">Premium (Hạng nhất)</option>
                          <option value="Standard">Standard (Tiêu chuẩn)</option>
                          <option value="Economy">Economy (Phổ thông)</option>
                        </select>
                      </div>
                      <div>
                        <label style={styles.label}>Thị trường</label>
                        <select 
                          value={batchData.targetMarket}
                          onChange={(e) => setBatchData(prev => ({ ...prev, targetMarket: e.target.value }))}
                          style={styles.input}
                        >
                          <option value="China">Trung Quốc</option>
                          <option value="Japan">Nhật Bản</option>
                          <option value="Domestic">Nội địa</option>
                        </select>
                      </div>
                    </div>
                    
                    <button className="btn btn-primary btn-block" onClick={createBatch}>
                      📦 Tạo lô xuất khẩu ({selectedRequests.length} sản phẩm)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Batches Tab - Lô hàng */}
        {activeTab === 'batches' && (
          <div className="glass-card">
            <div className="card-header">
              <h3 className="card-title">
                <span className="icon">📦</span>
                Danh sách lô hàng
              </h3>
            </div>
            
            {batches.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <div className="icon">📭</div>
                <h3>Chưa có lô hàng</h3>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {batches.map(batch => (
                  <div key={batch.batchID} style={styles.batchCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#81C784', fontSize: '1.1rem' }}>{batch.batchCode}</strong>
                      <span className={`card-badge ${batch.qrCodes?.length > 0 ? 'badge-success' : 'badge-warning'}`}>
                        {batch.qrCodes?.length > 0 ? '✅ Có QR' : '⏳ Chưa có QR'}
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <div>📦 Tổng: <strong>{batch.totalWeight}</strong> kg</div>
                      <div>🏷️ {batch.qualityGrade}</div>
                      <div>🌍 {batch.targetMarket}</div>
                    </div>
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                      {batch.qrCodes?.length === 0 && (
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => generateQR(batch.batchID)}
                        >
                          🔲 Tạo QR
                        </button>
                      )}
                      {batch.qrCodes?.length > 0 && (
                        <Link 
                          to={`/trace/${batch.batchCode}`}
                          className="btn btn-secondary btn-sm"
                        >
                          🔍 Xem truy xuất
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  tabs: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '2rem'
  },
  tab: {
    padding: '0.75rem 1.5rem',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '12px',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  tabActive: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, rgba(129, 199, 132, 0.3), rgba(102, 187, 106, 0.3))',
    border: '1px solid rgba(129, 199, 132, 0.5)',
    borderRadius: '12px',
    color: '#81C784',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    color: 'white'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: 'var(--text-secondary)',
    fontSize: '0.9rem'
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '10px',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95), rgba(45, 45, 45, 0.9))',
    padding: '2rem',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.15)',
    maxWidth: 500,
    width: '90%'
  },
  batchCard: {
    padding: '1rem',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)'
  }
};

// Add table styles
const tableStyles = `
  .glass-card table th, .glass-card table td {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }
  .glass-card table th {
    background: rgba(255,255,255,0.05);
    font-weight: 600;
    color: var(--text-secondary);
  }
  .glass-card table tr:hover td {
    background: rgba(255,255,255,0.05);
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = tableStyles;
  document.head.appendChild(style);
}

export default WarehousePage;
