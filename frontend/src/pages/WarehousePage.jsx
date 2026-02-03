import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import SharedHeader, { SharedFooter } from '../components/SharedHeader';
import '../styles/shared-header.css';

const WarehousePage = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('pending');
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
        warehouseId: 1,
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
      await api.post(`/qr/generate/${batchId}`);
      setMessage({ type: 'success', text: '✅ Đã tạo QR code!' });
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
      <div className="shared-page-layout">
        <SharedHeader
          title="Không có quyền truy cập"
          subtitle="Trang này dành cho Thủ kho / Admin"
          bannerIcon="🔐"
          navType="public"
        />
        <div className="shared-page-body">
          <main className="shared-page-main">
            <div style={styles.emptyState}>
              <span style={styles.emptyIcon}>🔐</span>
              <h3>Không có quyền truy cập</h3>
              <p>Trang này dành cho Thủ kho / Admin</p>
              <Link to="/" style={styles.btnPrimary}>Về Dashboard</Link>
            </div>
          </main>
        </div>
        <SharedFooter />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="shared-page-layout">
        <SharedHeader
          title="Quản lý Kho"
          subtitle="Đang tải dữ liệu..."
          bannerIcon="📦"
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
        title="Quản lý Kho"
        subtitle="Nhập kho, phân loại và tạo lô xuất khẩu"
        bannerIcon="📦"
        navType="public"
      />

      <div className="shared-page-body">
        <main className="shared-page-main">
          {/* Stats */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <span style={styles.statIcon}>📥</span>
              <span style={styles.statValue}>{pendingRequests.length}</span>
              <span style={styles.statLabel}>Chờ nhập kho</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statIcon}>✅</span>
              <span style={styles.statValue}>{completedRequests.length}</span>
              <span style={styles.statLabel}>Đã nhập kho</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statIcon}>📦</span>
              <span style={styles.statValue}>{batches.length}</span>
              <span style={styles.statLabel}>Lô hàng</span>
            </div>
          </div>

          {/* Message */}
          {message.text && (
            <div style={message.type === 'success' ? styles.successMsg : styles.errorMsg}>
              {message.text}
            </div>
          )}

          {/* Tabs */}
          <div style={styles.tabs}>
            <button
              style={activeTab === 'pending' ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab('pending')}
            >
              📥 Nhập kho ({pendingRequests.length})
            </button>
            <button
              style={activeTab === 'batching' ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab('batching')}
            >
              🔲 Tạo lô ({completedRequests.length})
            </button>
            <button
              style={activeTab === 'batches' ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab('batches')}
            >
              📦 Lô hàng ({batches.length})
            </button>
          </div>

          {/* Tab Content */}
          <div style={styles.tabContent}>
            {/* Pending Tab */}
            {activeTab === 'pending' && (
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>📥 Danh sách chờ nhập kho</h3>
                </div>

                {pendingRequests.length === 0 ? (
                  <div style={styles.emptyState}>
                    <span style={styles.emptyIcon}>📭</span>
                    <h3>Không có yêu cầu chờ</h3>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>Mã phiếu</th>
                          <th style={styles.th}>Nông dân</th>
                          <th style={styles.th}>Cây</th>
                          <th style={styles.th}>Ngày cắt</th>
                          <th style={styles.th}>Ước tính</th>
                          <th style={styles.th}>Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingRequests.map(request => (
                          <tr key={request.requestID}>
                            <td style={styles.td}><strong style={{ color: '#2d5a27' }}>{request.requestCode}</strong></td>
                            <td style={styles.td}>{request.farmer?.fullName || 'N/A'}</td>
                            <td style={styles.td}>{request.tree?.treeCode}</td>
                            <td style={styles.td}>{formatDate(request.expectedHarvestDate)}</td>
                            <td style={styles.td}>{request.estimatedQuantity} kg</td>
                            <td style={styles.td}>
                              <button
                                style={styles.btnPrimary}
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
                      <h3 style={styles.modalTitle}>📥 Nhập kho</h3>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>Tổng số lượng thực tế (kg)</label>
                        <input
                          type="number"
                          value={checkInData.actualQuantity}
                          onChange={(e) => setCheckInData(prev => ({ ...prev, actualQuantity: e.target.value }))}
                          style={styles.input}
                        />
                      </div>

                      <div style={styles.formRow}>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Loại A (kg)</label>
                          <input
                            type="number"
                            placeholder="Xuất khẩu"
                            value={checkInData.gradeA}
                            onChange={(e) => setCheckInData(prev => ({ ...prev, gradeA: e.target.value }))}
                            style={styles.input}
                          />
                        </div>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Loại B (kg)</label>
                          <input
                            type="number"
                            placeholder="Chế biến"
                            value={checkInData.gradeB}
                            onChange={(e) => setCheckInData(prev => ({ ...prev, gradeB: e.target.value }))}
                            style={styles.input}
                          />
                        </div>
                        <div style={styles.formGroup}>
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

                      <div style={styles.modalButtons}>
                        <button style={styles.btnPrimary} onClick={submitCheckIn}>
                          ✅ Xác nhận nhập kho
                        </button>
                        <button
                          style={styles.btnSecondary}
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

            {/* Batching Tab */}
            {activeTab === 'batching' && (
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>🔲 Tạo lô xuất khẩu</h3>
                  <span style={styles.badgeInfo}>Đã chọn: {selectedRequests.length}</span>
                </div>

                {completedRequests.length === 0 ? (
                  <div style={styles.emptyState}>
                    <span style={styles.emptyIcon}>📭</span>
                    <h3>Chưa có sản phẩm trong kho</h3>
                    <p>Vui lòng nhập kho sản phẩm trước</p>
                  </div>
                ) : (
                  <>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={styles.table}>
                        <thead>
                          <tr>
                            <th style={styles.th}>Chọn</th>
                            <th style={styles.th}>Mã phiếu</th>
                            <th style={styles.th}>Nông dân</th>
                            <th style={styles.th}>Loại A</th>
                            <th style={styles.th}>Loại B</th>
                            <th style={styles.th}>Loại C</th>
                            <th style={styles.th}>Tổng</th>
                          </tr>
                        </thead>
                        <tbody>
                          {completedRequests.map(request => (
                            <tr key={request.requestID}>
                              <td style={styles.td}>
                                <input
                                  type="checkbox"
                                  checked={selectedRequests.includes(request.requestID)}
                                  onChange={() => toggleSelectRequest(request.requestID)}
                                  style={{ width: '20px', height: '20px' }}
                                />
                              </td>
                              <td style={styles.td}><strong style={{ color: '#2d5a27' }}>{request.requestCode}</strong></td>
                              <td style={styles.td}>{request.farmer?.fullName || 'N/A'}</td>
                              <td style={styles.td}>{request.gradeA_Quantity || 0} kg</td>
                              <td style={styles.td}>{request.gradeB_Quantity || 0} kg</td>
                              <td style={styles.td}>{request.gradeC_Quantity || 0} kg</td>
                              <td style={styles.td}><strong>{request.actualQuantity || 0} kg</strong></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {selectedRequests.length > 0 && (
                      <div style={styles.batchForm}>
                        <div style={styles.formRow}>
                          <div style={styles.formGroup}>
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
                          <div style={styles.formGroup}>
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

                        <button style={{ ...styles.btnPrimary, width: '100%' }} onClick={createBatch}>
                          📦 Tạo lô xuất khẩu ({selectedRequests.length} sản phẩm)
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Batches Tab */}
            {activeTab === 'batches' && (
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>📦 Danh sách lô hàng</h3>
                </div>

                {batches.length === 0 ? (
                  <div style={styles.emptyState}>
                    <span style={styles.emptyIcon}>📭</span>
                    <h3>Chưa có lô hàng</h3>
                  </div>
                ) : (
                  <div style={styles.batchList}>
                    {batches.map(batch => (
                      <div key={batch.batchID} style={styles.batchCard}>
                        <div style={styles.batchHeader}>
                          <strong style={{ color: '#2d5a27', fontSize: '1.1rem' }}>{batch.batchCode}</strong>
                          <span style={batch.qrCodes?.length > 0 ? styles.badgeSuccess : styles.badgeWarning}>
                            {batch.qrCodes?.length > 0 ? '✅ Có QR' : '⏳ Chưa có QR'}
                          </span>
                        </div>
                        <div style={styles.batchInfo}>
                          <span>📦 Tổng: <strong>{batch.totalWeight}</strong> kg</span>
                          <span>🏷️ {batch.qualityGrade}</span>
                          <span>🌍 {batch.targetMarket}</span>
                        </div>
                        <div style={styles.batchActions}>
                          {batch.qrCodes?.length === 0 && (
                            <button
                              style={styles.btnPrimary}
                              onClick={() => generateQR(batch.batchID)}
                            >
                              🔲 Tạo QR
                            </button>
                          )}
                          {batch.qrCodes?.length > 0 && (
                            <Link
                              to={`/trace/${batch.batchCode}`}
                              style={styles.btnOutline}
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
        </main>
      </div>

      <SharedFooter />
    </div>
  );
};

const styles = {
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
  tabs: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    borderBottom: '1px solid #e5e5e5',
    paddingBottom: '0.5rem',
  },
  tab: {
    padding: '0.75rem 1.5rem',
    background: '#fafafa',
    border: '1px solid #e5e5e5',
    borderRadius: '4px 4px 0 0',
    color: '#555',
    cursor: 'pointer',
    fontWeight: 500,
  },
  tabActive: {
    padding: '0.75rem 1.5rem',
    background: '#2d5a27',
    border: '1px solid #2d5a27',
    borderRadius: '4px 4px 0 0',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 600,
  },
  tabContent: {},
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
    padding: '1rem 1.5rem',
    borderBottom: '1px solid #f0f0f0',
    background: '#fafafa',
  },
  cardTitle: { fontSize: '1rem', fontWeight: 600, color: '#1a1a1a', margin: 0 },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '0.75rem 1rem',
    textAlign: 'left',
    background: '#fafafa',
    fontWeight: 600,
    color: '#555',
    borderBottom: '1px solid #e5e5e5',
  },
  td: {
    padding: '0.75rem 1rem',
    borderBottom: '1px solid #f0f0f0',
    color: '#1a1a1a',
  },
  formGroup: {
    marginBottom: '1rem',
    flex: 1,
  },
  formRow: {
    display: 'flex',
    gap: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#555',
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    background: '#fafafa',
    border: '1px solid #e5e5e5',
    borderRadius: '4px',
    color: '#1a1a1a',
    fontSize: '1rem',
    boxSizing: 'border-box',
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
    display: 'inline-block',
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
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
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
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    maxWidth: '500px',
    width: '90%',
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    marginBottom: '1.5rem',
    color: '#1a1a1a',
  },
  modalButtons: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem',
  },
  batchForm: {
    padding: '1.5rem',
    borderTop: '1px solid #e5e5e5',
  },
  batchList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '1.5rem',
  },
  batchCard: {
    padding: '1rem',
    background: '#fafafa',
    border: '1px solid #e5e5e5',
    borderRadius: '8px',
  },
  batchHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  batchInfo: {
    display: 'flex',
    gap: '1.5rem',
    fontSize: '0.9rem',
    color: '#555',
    marginBottom: '1rem',
  },
  batchActions: {
    display: 'flex',
    gap: '0.5rem',
  },
};

export default WarehousePage;
