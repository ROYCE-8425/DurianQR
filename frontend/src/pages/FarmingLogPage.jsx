import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import SharedHeader, { SharedFooter } from '../components/SharedHeader';
import '../styles/shared-header.css';

const FarmingLogPage = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [farms, setFarms] = useState([]);
    const [trees, setTrees] = useState([]);
    const [logs, setLogs] = useState([]);

    const [formData, setFormData] = useState({
        treeId: '', activityType: 'Watering', description: '',
        chemicalUsed: '', dosage: '', phiDays: ''
    });

    const activityTypes = [
        { value: 'Watering', label: '💧 Tưới nước' },
        { value: 'Fertilizer', label: '🧪 Bón phân' },
        { value: 'Pesticide', label: '💊 Phun thuốc BVTV' },
        { value: 'Pruning', label: '✂️ Tỉa cành' },
        { value: 'Harvest', label: '🍈 Thu hoạch' },
        { value: 'Other', label: '📝 Khác' },
    ];

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [farmsRes, logsRes] = await Promise.all([api.get('/farms'), api.get('/farming-logs')]);
            setFarms(farmsRes.data);
            setLogs(logsRes.data);
            const allTrees = farmsRes.data.flatMap(farm =>
                (farm.trees || []).map(tree => ({ ...tree, farmName: farm.farmName }))
            );
            setTrees(allTrees);
        } catch (error) { console.error('Error:', error); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.treeId) { setMessage({ type: 'error', text: 'Vui lòng chọn cây' }); return; }
        setSubmitting(true); setMessage({ type: '', text: '' });
        try {
            await api.post('/farming-logs', {
                treeId: parseInt(formData.treeId), userId: user?.UserID,
                activityType: formData.activityType, description: formData.description,
                chemicalUsed: formData.activityType === 'Pesticide' ? formData.chemicalUsed : null,
                dosage: formData.activityType === 'Pesticide' ? formData.dosage : null,
                phiDays: formData.activityType === 'Pesticide' ? parseInt(formData.phiDays) || 0 : 0,
                date: new Date().toISOString()
            });
            setMessage({ type: 'success', text: '✅ Đã ghi nhật ký thành công!' });
            setFormData({ treeId: '', activityType: 'Watering', description: '', chemicalUsed: '', dosage: '', phiDays: '' });
            fetchData();
        } catch (error) { setMessage({ type: 'error', text: error.response?.data?.message || 'Lỗi' }); }
        finally { setSubmitting(false); }
    };

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : 'N/A';

    if (loading) {
        return (
            <div className="shared-page-layout">
                <SharedHeader title="Nhật ký canh tác" subtitle="Đang tải..." bannerIcon="📝" navType="farmer" />
                <div style={styles.loading}><p>Đang tải...</p></div>
                <SharedFooter />
            </div>
        );
    }

    return (
        <div className="shared-page-layout">
            <SharedHeader title="Nhật ký canh tác" subtitle="Ghi lại các hoạt động chăm sóc vườn sầu riêng" bannerIcon="📝" navType="farmer" />
            <div className="shared-page-body">
                <aside style={styles.sidebar}>
                    <h3 style={styles.sidebarTitle}>📋 MENU</h3>
                    <Link to="/farmer" style={styles.link}>🏠 Trang chủ</Link>
                    <Link to="/farming-log" style={{ ...styles.link, background: '#e8f5e9', color: '#2d5a27' }}>📝 Nhật ký</Link>
                    <Link to="/harvest-request" style={styles.link}>🌳 Thu hoạch</Link>
                </aside>
                <main className="shared-page-main">
                    {message.text && <div style={message.type === 'success' ? styles.success : styles.error}>{message.text}</div>}
                    <section style={styles.section}>
                        <h2 style={styles.sectionTitle}>➕ Thêm hoạt động</h2>
                        <div style={styles.card}>
                            <form onSubmit={handleSubmit}>
                                <div style={styles.row}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Cây *</label>
                                        <select value={formData.treeId} onChange={(e) => setFormData({ ...formData, treeId: e.target.value })} style={styles.input} required>
                                            <option value="">-- Chọn --</option>
                                            {trees.map(t => <option key={t.treeID} value={t.treeID}>{t.treeCode} - {t.variety}</option>)}
                                        </select>
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Loại hoạt động</label>
                                        <select value={formData.activityType} onChange={(e) => setFormData({ ...formData, activityType: e.target.value })} style={styles.input}>
                                            {activityTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Mô tả</label>
                                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ ...styles.input, minHeight: '80px' }} placeholder="..." />
                                </div>
                                {formData.activityType === 'Pesticide' && (
                                    <div style={styles.warning}>
                                        <h4>⚠️ Thông tin thuốc BVTV</h4>
                                        <div style={styles.row}>
                                            <input type="text" value={formData.chemicalUsed} onChange={(e) => setFormData({ ...formData, chemicalUsed: e.target.value })} style={styles.input} placeholder="Tên thuốc" required />
                                            <input type="text" value={formData.dosage} onChange={(e) => setFormData({ ...formData, dosage: e.target.value })} style={styles.input} placeholder="Liều lượng" />
                                            <input type="number" value={formData.phiDays} onChange={(e) => setFormData({ ...formData, phiDays: e.target.value })} style={styles.input} placeholder="Ngày cách ly" required />
                                        </div>
                                    </div>
                                )}
                                <button type="submit" style={styles.btn} disabled={submitting}>{submitting ? 'Đang lưu...' : '💾 Lưu'}</button>
                            </form>
                        </div>
                    </section>
                    <section style={styles.section}>
                        <h2 style={styles.sectionTitle}>📋 Lịch sử</h2>
                        {logs.length === 0 ? <div style={styles.empty}><span>📝</span><h3>Chưa có nhật ký</h3></div> : (
                            <div style={styles.list}>
                                {logs.map((log, i) => (
                                    <div key={i} style={styles.logCard}>
                                        <strong>{log.activityType}</strong> - {formatDate(log.date)}
                                        <p style={{ margin: '0.5rem 0', color: '#555' }}>{log.description}</p>
                                        {log.treeCode && <span style={styles.tag}>🌳 {log.treeCode}</span>}
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

const styles = {
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
    warning: { background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' },
    btn: { width: '100%', padding: '0.875rem', background: '#2d5a27', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' },
    list: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
    logCard: { padding: '1rem', background: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px' },
    tag: { padding: '0.25rem 0.5rem', background: '#f0f0f0', borderRadius: '4px', fontSize: '0.75rem' },
    empty: { textAlign: 'center', padding: '3rem', background: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', color: '#888' },
    loading: { display: 'flex', justifyContent: 'center', padding: '3rem', flex: 1 },
};

export default FarmingLogPage;
