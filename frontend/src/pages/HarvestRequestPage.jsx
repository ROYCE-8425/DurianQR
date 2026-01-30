import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/global.css';

const HarvestRequestPage = () => {
  const [trees, setTrees] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [phiResult, setPHIResult] = useState(null);
  const [myRequests, setMyRequests] = useState([]);
  
  const user = JSON.parse(localStorage.getItem('user'));
  
  const [formData, setFormData] = useState({
    treeId: '',
    expectedHarvestDate: '',
    estimatedQuantity: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [farmsRes, requestsRes] = await Promise.all([
        api.get('/farms'),
        api.get(`/harvest-requests/my?userId=${user?.UserID || 0}`)
      ]);
      setFarms(farmsRes.data);
      setMyRequests(requestsRes.data);
      
      // Flatten trees from all farms
      const allTrees = farmsRes.data.flatMap(farm => 
        (farm.trees || []).map(tree => ({
          ...tree,
          farmName: farm.farmName
        }))
      );
      setTrees(allTrees);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear PHI result when tree changes
    if (name === 'treeId') {
      setPHIResult(null);
    }
  };

  const checkPHI = async () => {
    if (!formData.treeId) {
      setMessage({ type: 'error', text: 'Vui lòng chọn cây trước' });
      return;
    }

    setChecking(true);
    setMessage({ type: '', text: '' });

    try {
      const params = formData.expectedHarvestDate 
        ? `?harvestDate=${formData.expectedHarvestDate}` 
        : '';
      const response = await api.get(`/harvest-requests/check-phi/${formData.treeId}${params}`);
      setPHIResult(response.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Không thể kiểm tra PHI' });
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.treeId || !formData.expectedHarvestDate || !formData.estimatedQuantity) {
      setMessage({ type: 'error', text: 'Vui lòng điền đầy đủ thông tin' });
      return;
    }

    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.post('/harvest-requests', {
        treeId: parseInt(formData.treeId),
        userId: user.UserID,
        expectedHarvestDate: formData.expectedHarvestDate,
        estimatedQuantity: parseFloat(formData.estimatedQuantity)
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: response.data.message });
        setFormData({ treeId: '', expectedHarvestDate: '', estimatedQuantity: '' });
        setPHIResult(null);
        fetchData(); // Refresh requests list
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Không thể tạo yêu cầu' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'Pending': { class: 'badge-warning', text: '⏳ Chờ duyệt' },
      'Approved': { class: 'badge-success', text: '✅ Đã duyệt' },
      'Rejected': { class: 'badge-danger', text: '❌ Từ chối' },
      'CheckedIn': { class: 'badge-info', text: '📦 Đã nhập kho' },
      'Completed': { class: 'badge-success', text: '✅ Hoàn thành' },
      'Cancelled': { class: 'badge-danger', text: '🚫 Đã hủy' }
    };
    return statusMap[status] || { class: '', text: status };
  };

  if (!user) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="icon">🔐</div>
          <h3>Vui lòng đăng nhập</h3>
          <p>Bạn cần đăng nhập để tạo yêu cầu thu hoạch</p>
          <Link to="/login" className="btn btn-primary">Đăng nhập</Link>
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
        <span className="page-icon">🌳</span>
        <h1 className="page-title">Yêu cầu Thu hoạch</h1>
        <p className="page-subtitle">Tạo phiếu xin cắt sầu riêng - Hệ thống sẽ tự động kiểm tra PHI</p>
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
          maxWidth: 600, 
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: 1200, margin: '0 auto' }}>
        {/* Form */}
        <div className="glass-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="icon">📝</span>
              Tạo yêu cầu mới
            </h3>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: '1rem 0' }}>
            {/* Select Tree */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={styles.label}>Chọn cây sầu riêng</label>
              <select 
                name="treeId"
                value={formData.treeId}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="">-- Chọn cây --</option>
                {trees.map(tree => (
                  <option key={tree.treeID} value={tree.treeID}>
                    {tree.treeCode} - {tree.variety || 'N/A'} ({tree.farmName})
                  </option>
                ))}
              </select>
            </div>

            {/* Check PHI Button */}
            {formData.treeId && (
              <div style={{ marginBottom: '1.5rem' }}>
                <button 
                  type="button"
                  onClick={checkPHI}
                  className="btn btn-secondary"
                  disabled={checking}
                  style={{ width: '100%' }}
                >
                  {checking ? '🔄 Đang kiểm tra...' : '🔍 Kiểm tra PHI (thời gian cách ly)'}
                </button>
              </div>
            )}

            {/* PHI Result */}
            {phiResult && (
              <div style={{
                ...styles.phiResult,
                borderColor: phiResult.canHarvest ? 'rgba(76,175,80,0.5)' : 'rgba(244,67,54,0.5)',
                background: phiResult.canHarvest ? 'rgba(76,175,80,0.1)' : 'rgba(244,67,54,0.1)'
              }}>
                <div style={{ 
                  fontWeight: 700, 
                  fontSize: '1.1rem',
                  color: phiResult.canHarvest ? '#81C784' : '#EF5350',
                  marginBottom: '0.5rem'
                }}>
                  {phiResult.message}
                </div>
                {phiResult.lastSpray && (
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <div>📅 Lần phun cuối: {formatDate(phiResult.lastSpray.date)}</div>
                    <div>💊 Thuốc: {phiResult.lastSpray.chemical}</div>
                    <div>⏱️ PHI: {phiResult.lastSpray.phiDays} ngày</div>
                  </div>
                )}
                {phiResult.daysRemaining > 0 && (
                  <div style={{ marginTop: '0.5rem', color: '#FFD54F' }}>
                    ⏳ Còn {phiResult.daysRemaining} ngày nữa
                  </div>
                )}
              </div>
            )}

            {/* Expected Harvest Date */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={styles.label}>Ngày dự kiến cắt</label>
              <input 
                type="date"
                name="expectedHarvestDate"
                value={formData.expectedHarvestDate}
                onChange={handleChange}
                style={styles.input}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Estimated Quantity */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={styles.label}>Số lượng ước tính (kg)</label>
              <input 
                type="number"
                name="estimatedQuantity"
                value={formData.estimatedQuantity}
                onChange={handleChange}
                placeholder="VD: 500"
                style={styles.input}
                min="0"
                step="0.1"
              />
            </div>

            {/* Submit */}
            <button 
              type="submit"
              className="btn btn-primary btn-block"
              disabled={submitting || (phiResult && !phiResult.canHarvest)}
              style={{ marginTop: '1rem' }}
            >
              {submitting ? '⏳ Đang gửi...' : '📨 Gửi yêu cầu'}
            </button>
          </form>
        </div>

        {/* My Requests */}
        <div className="glass-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="icon">📋</span>
              Yêu cầu của tôi
            </h3>
          </div>

          {myRequests.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem 1rem' }}>
              <div className="icon">📭</div>
              <h3>Chưa có yêu cầu</h3>
              <p>Tạo yêu cầu đầu tiên ở bên trái</p>
            </div>
          ) : (
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {myRequests.map((request, index) => {
                const status = getStatusBadge(request.status);
                return (
                  <div 
                    key={request.requestID} 
                    style={styles.requestItem}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#81C784' }}>{request.requestCode}</strong>
                      <span className={`card-badge ${status.class}`}>{status.text}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <div>🌳 Cây: {request.tree?.treeCode}</div>
                      <div>📅 Ngày cắt: {formatDate(request.expectedHarvestDate)}</div>
                      <div>⚖️ Ước tính: {request.estimatedQuantity} kg</div>
                    </div>
                    {request.approvalNote && (
                      <div style={{ 
                        marginTop: '0.5rem', 
                        fontSize: '0.8rem', 
                        color: request.status === 'Approved' ? '#81C784' : '#EF5350',
                        fontStyle: 'italic'
                      }}>
                        💬 {request.approvalNote}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
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
  select: {
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
  phiResult: {
    padding: '1rem',
    borderRadius: '12px',
    border: '1px solid',
    marginBottom: '1.5rem'
  },
  requestItem: {
    padding: '1rem',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    transition: 'background 0.3s ease'
  }
};

export default HarvestRequestPage;
