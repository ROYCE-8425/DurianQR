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
    return statusMap[status] || { class: 'badge-secondary', text: status };
  };

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <div className="empty-state bg-white shadow-sm p-5 rounded-lg border border-gray-100">
          <div className="text-4xl mb-3">🔐</div>
          <h3>Vui lòng đăng nhập</h3>
          <p className="text-muted mb-4">Bạn cần đăng nhập để tạo yêu cầu thu hoạch</p>
          <Link to="/login" className="btn btn-primary">Đăng nhập</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container pb-5">
      {/* Header */}
      <div className="page-header flex justify-between items-center mb-4">
        <div>
          <h1 className="page-title">Yêu cầu Thu hoạch</h1>
          <p className="page-subtitle">Tạo phiếu xin cắt sầu riêng - Hệ thống sẽ tự động kiểm tra PHI</p>
        </div>
        <div className="flex gap-2">
           <Link to="/" className="btn btn-outline">
              <span className="icon">🏠</span> Dashboard
           </Link>
           <Link to="/trace" className="btn btn-outline">
              <span className="icon">🔍</span> Truy xuất
           </Link>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'} mb-4`}>
           {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Form */}
        <div className="card h-100">
          <div className="card-header bg-success text-white">
            <h3 className="card-title text-white">
              <span className="icon">📝</span>
              Tạo yêu cầu mới
            </h3>
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {/* Select Tree */}
              <div className="form-group mb-4">
                <label className="form-label">Chọn cây sầu riêng</label>
                <select 
                  name="treeId"
                  className="form-control"
                  value={formData.treeId}
                  onChange={handleChange}
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
                <div className="mb-4">
                  <button 
                    type="button"
                    onClick={checkPHI}
                    className="btn btn-outline-primary w-full"
                    disabled={checking}
                  >
                    {checking ? '🔄 Đang kiểm tra...' : '🔍 Kiểm tra PHI (thời gian cách ly)'}
                  </button>
                </div>
              )}

              {/* PHI Result */}
              {phiResult && (
                <div className={`alert ${phiResult.canHarvest ? 'alert-success' : 'alert-danger'} mb-4`}>
                  <div className="font-bold text-lg mb-2">
                    {phiResult.message}
                  </div>
                  {phiResult.lastSpray && (
                    <div className="text-sm">
                      <div>📅 Lần phun cuối: <strong>{formatDate(phiResult.lastSpray.date)}</strong></div>
                      <div>💊 Thuốc: {phiResult.lastSpray.chemical}</div>
                      <div>⏱️ PHI: {phiResult.lastSpray.phiDays} ngày</div>
                    </div>
                  )}
                  {phiResult.daysRemaining > 0 && (
                    <div className="mt-2 font-bold text-warning">
                      ⏳ Còn {phiResult.daysRemaining} ngày nữa mới được cắt
                    </div>
                  )}
                </div>
              )}

              {/* Expected Harvest Date */}
              <div className="form-group mb-4">
                <label className="form-label">Ngày dự kiến cắt</label>
                <input 
                  type="date"
                  name="expectedHarvestDate"
                  className="form-control"
                  value={formData.expectedHarvestDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Estimated Quantity */}
              <div className="form-group mb-4">
                <label className="form-label">Số lượng ước tính (kg)</label>
                <input 
                  type="number"
                  name="estimatedQuantity"
                  className="form-control"
                  value={formData.estimatedQuantity}
                  onChange={handleChange}
                  placeholder="VD: 500"
                  min="0"
                  step="0.1"
                />
              </div>

              {/* Submit */}
              <button 
                type="submit"
                className="btn btn-success w-full py-3 text-lg font-bold shadow-sm"
                disabled={submitting || (phiResult && !phiResult.canHarvest)}
              >
                {submitting ? '⏳ Đang gửi...' : '📨 Gửi yêu cầu'}
              </button>
            </form>
          </div>
        </div>

        {/* My Requests */}
        <div className="card h-100">
          <div className="card-header border-bottom">
            <h3 className="card-title">
              <span className="icon">📋</span>
              Yêu cầu của tôi
            </h3>
          </div>

          <div className="card-body p-0">
            {myRequests.length === 0 ? (
              <div className="text-center py-5">
                <div className="text-4xl mb-2">📭</div>
                <h3 className="text-lg font-medium">Chưa có yêu cầu</h3>
                <p className="text-muted">Tạo yêu cầu đầu tiên ở bên trái</p>
              </div>
            ) : (
              <div className="overflow-auto" style={{ maxHeight: '600px' }}>
                {myRequests.map((request, index) => {
                  const status = getStatusBadge(request.status);
                  return (
                    <div 
                      key={request.requestID} 
                      className="p-4 border-b hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <strong className="text-success text-lg">{request.requestCode}</strong>
                        <span className={`badge ${status.class}`}>{status.text}</span>
                      </div>
                      <div className="text-sm text-muted grid grid-cols-2 gap-2">
                        <div>🌳 Cây: <span className="text-dark font-medium">{request.tree?.treeCode}</span></div>
                        <div>📅 Ngày cắt: <span className="text-dark">{formatDate(request.expectedHarvestDate)}</span></div>
                        <div>⚖️ Ước tính: <span className="text-dark">{request.estimatedQuantity} kg</span></div>
                      </div>
                      {request.approvalNote && (
                        <div className={`mt-2 text-sm italic p-2 rounded ${request.status === 'Approved' ? 'bg-green-50 text-success' : 'bg-red-50 text-danger'}`}>
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
    </div>
  );
};

export default HarvestRequestPage;
