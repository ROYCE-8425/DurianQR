import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import SharedHeader, { SharedFooter } from '../components/SharedHeader';
import '../styles/shared-header.css';

const HarvestRequestPage = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [trees, setTrees] = useState([]);
  const [requests, setRequests] = useState([]);
  const [phiInfo, setPhiInfo] = useState(null);

  const [formData, setFormData] = useState({
    treeId: '', expectedHarvestDate: '', estimatedQuantity: '', notes: ''
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [farmsRes, reqRes] = await Promise.all([api.get('/farms'), api.get('/harvest-requests')]);
      const allTrees = farmsRes.data.flatMap(farm =>
        (farm.trees || []).map(tree => ({ ...tree, farmName: farm.farmName }))
      );
      setTrees(allTrees);
      setRequests(reqRes.data);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  const checkPHI = async (treeId) => {
    if (!treeId) { setPhiInfo(null); return; }
    try {
      const res = await api.get(`/trees/${treeId}/phi-status`);
      setPhiInfo(res.data);
    } catch { setPhiInfo({ isSafe: true, daysRemaining: 0 }); }
  };

  const handleTreeChange = (treeId) => {
    setFormData({ ...formData, treeId });
    checkPHI(treeId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.treeId || !formData.expectedHarvestDate) {
      setMessage({ type: 'error', text: 'Vui lòng điền đủ thông tin' }); return;
    }
    if (phiInfo && !phiInfo.isSafe) {
      setMessage({ type: 'error', text: `⚠️ Còn ${phiInfo.daysRemaining} ngày cách ly` }); return;
    }
    setSubmitting(true); setMessage({ type: '', text: '' });
    try {
      await api.post('/harvest-requests', {
        treeId: parseInt(formData.treeId), userId: user?.UserID,
        expectedHarvestDate: formData.expectedHarvestDate,
        estimatedQuantity: parseFloat(formData.estimatedQuantity) || 0,
        notes: formData.notes, status: 'Pending'
      });
      setMessage({ type: 'success', text: '✅ Đã gửi yêu cầu thành công!' });
      setFormData({ treeId: '', expectedHarvestDate: '', estimatedQuantity: '', notes: '' });
      setPhiInfo(null); fetchData();
    } catch (error) { setMessage({ type: 'error', text: error.response?.data?.message || 'Lỗi' }); }
    finally { setSubmitting(false); }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : 'N/A';
  const getStatusBadge = (status) => {
    const styles = {
      Pending: { background: '#fff3e0', color: '#e65100' },
      Approved: { background: '#e8f5e9', color: '#2e7d32' },
      Completed: { background: '#e3f2fd', color: '#1565c0' },
      Rejected: { background: '#ffebee', color: '#c62828' },
    };
    return styles[status] || styles.Pending;
  };

  if (loading) {
    return (
      <div className="shared-page-layout">
        <SharedHeader title="Yêu cầu thu hoạch" subtitle="Đang tải..." bannerIcon="🌳" navType="farmer" />
        <div style={st.loading}><p>Đang tải...</p></div>
        <SharedFooter />
      </div>
    );
  }

  return (
    <div className="shared-page-layout">
      <SharedHeader title="Yêu cầu thu hoạch" subtitle="Đăng ký thu hoạch và kiểm tra thời gian cách ly" bannerIcon="🌳" navType="farmer" />
      <div className="shared-page-body">
        <aside style={st.sidebar}>
          <h3 style={st.sidebarTitle}>📋 MENU</h3>
          <Link to="/farmer" style={st.link}>🏠 Trang chủ</Link>
          <Link to="/farming-log" style={st.link}>📝 Nhật ký</Link>
          <Link to="/harvest-request" style={{ ...st.link, background: '#e8f5e9', color: '#2d5a27' }}>🌳 Thu hoạch</Link>
        </aside>
        <main className="shared-page-main">
          {message.text && <div style={message.type === 'success' ? st.success : st.error}>{message.text}</div>}

          <section style={st.section}>
            <h2 style={st.sectionTitle}>📋 Tạo yêu cầu thu hoạch</h2>
            <div style={st.card}>
              <form onSubmit={handleSubmit}>
                <div style={st.row}>
                  <div style={st.formGroup}>
                    <label style={st.label}>Chọn cây *</label>
                    <select value={formData.treeId} onChange={(e) => handleTreeChange(e.target.value)} style={st.input} required>
                      <option value="">-- Chọn --</option>
                      {trees.map(t => <option key={t.treeID} value={t.treeID}>{t.treeCode} - {t.variety}</option>)}
                    </select>
                  </div>
                  <div style={st.formGroup}>
                    <label style={st.label}>Ngày thu hoạch dự kiến *</label>
                    <input type="date" value={formData.expectedHarvestDate} onChange={(e) => setFormData({ ...formData, expectedHarvestDate: e.target.value })} style={st.input} required />
                  </div>
                  <div style={st.formGroup}>
                    <label style={st.label}>Sản lượng ước tính (kg)</label>
                    <input type="number" value={formData.estimatedQuantity} onChange={(e) => setFormData({ ...formData, estimatedQuantity: e.target.value })} style={st.input} placeholder="VD: 100" />
                  </div>
                </div>

                {phiInfo && (
                  <div style={phiInfo.isSafe ? st.phiSafe : st.phiWarning}>
                    {phiInfo.isSafe ? '✅ An toàn - Đã qua thời gian cách ly' : `⚠️ Chưa đủ thời gian cách ly. Còn ${phiInfo.daysRemaining} ngày.`}
                  </div>
                )}

                <div style={st.formGroup}>
                  <label style={st.label}>Ghi chú</label>
                  <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} style={{ ...st.input, minHeight: '80px' }} placeholder="Ghi chú thêm..." />
                </div>
                <button type="submit" style={st.btn} disabled={submitting || (phiInfo && !phiInfo.isSafe)}>
                  {submitting ? 'Đang gửi...' : '📤 Gửi yêu cầu'}
                </button>
              </form>
            </div>
          </section>

          <section style={st.section}>
            <h2 style={st.sectionTitle}>📋 Danh sách yêu cầu</h2>
            {requests.length === 0 ? (
              <div style={st.empty}><span style={{ fontSize: '3rem' }}>🌳</span><h3>Chưa có yêu cầu</h3></div>
            ) : (
              <div style={st.list}>
                {requests.map((req, i) => (
                  <div key={i} style={st.reqCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ color: '#2d5a27' }}>{req.requestCode || `REQ-${i + 1}`}</strong>
                      <span style={{ ...st.badge, ...getStatusBadge(req.status) }}>{req.status}</span>
                    </div>
                    <div style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: '#555' }}>
                      <div>🌳 Cây: {req.tree?.treeCode || 'N/A'}</div>
                      <div>📅 Ngày: {formatDate(req.expectedHarvestDate)}</div>
                      <div>⚖️ Ước tính: {req.estimatedQuantity || 0} kg</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
      <SharedFooter />
    </div>
  );
};

const st = {
  sidebar: { width: '220px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '1rem', height: 'fit-content' },
  sidebarTitle: { fontSize: '0.75rem', fontWeight: 700, color: '#888', marginBottom: '1rem' },
  link: { display: 'block', padding: '0.75rem', color: '#555', textDecoration: 'none', borderRadius: '4px', marginBottom: '0.25rem' },
  success: { padding: '1rem', background: '#e8f5e9', border: '1px solid #c8e6c9', borderRadius: '8px', color: '#2e7d32', marginBottom: '1rem' },
  error: { padding: '1rem', background: '#ffebee', border: '1px solid #ffcdd2', borderRadius: '8px', color: '#c62828', marginBottom: '1rem' },
  section: { marginBottom: '2rem' },
  sectionTitle: { fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e5e5e5' },
  card: { background: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '1.5rem' },
  row: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' },
  formGroup: { marginBottom: '1rem' },
  label: { display: 'block', marginBottom: '0.5rem', color: '#555', fontSize: '0.875rem', fontWeight: 500 },
  input: { width: '100%', padding: '0.75rem', background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '4px', boxSizing: 'border-box' },
  phiSafe: { padding: '1rem', background: '#e8f5e9', border: '1px solid #c8e6c9', borderRadius: '8px', color: '#2e7d32', marginBottom: '1rem' },
  phiWarning: { padding: '1rem', background: '#fff3e0', border: '1px solid #ffcc80', borderRadius: '8px', color: '#e65100', marginBottom: '1rem' },
  btn: { width: '100%', padding: '0.875rem', background: '#2d5a27', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' },
  list: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' },
  reqCard: { padding: '1rem', background: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px' },
  badge: { padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 },
  empty: { textAlign: 'center', padding: '3rem', background: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', color: '#888' },
  loading: { display: 'flex', justifyContent: 'center', padding: '3rem', flex: 1 },
};

export default HarvestRequestPage;
