import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/global.css';

const FarmingLogPage = () => {
    const [logs, setLogs] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        activityType: 'Fertilizing',
        productUsed: '',
        quantity: '',
        unit: 'kg',
        notes: ''
    });

    const activityTypes = [
        { value: 'Fertilizing', label: '🧪 Bón phân', color: '#4CAF50' },
        { value: 'Watering', label: '💧 Tưới nước', color: '#2196F3' },
        { value: 'Pesticide', label: '🐛 Phun thuốc BVTV', color: '#FF9800' },
        { value: 'Pruning', label: '✂️ Tỉa cành', color: '#9C27B0' },
        { value: 'Flowering', label: '🌸 Ra hoa', color: '#E91E63' },
        { value: 'Other', label: '📝 Khác', color: '#607D8B' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        const newLog = {
            id: Date.now(),
            ...formData,
            timestamp: new Date().toISOString()
        };
        setLogs([newLog, ...logs]);
        setFormData({ activityType: 'Fertilizing', productUsed: '', quantity: '', unit: 'kg', notes: '' });
        setShowForm(false);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    return (
        <div className="page-container">
            {/* Header */}
            <div className="page-header">
                <span className="page-icon">📝</span>
                <h1 className="page-title">Nhật ký canh tác</h1>
                <p className="page-subtitle">Ghi chép hoạt động chăm sóc cây hàng ngày</p>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <button
                    className="quick-action-btn"
                    onClick={() => setShowForm(!showForm)}
                    style={{ cursor: 'pointer', border: showForm ? '2px solid #FFF59D' : undefined }}
                >
                    <span className="icon">➕</span>
                    <span>Thêm hoạt động</span>
                </button>
                <Link to="/harvest-request" className="quick-action-btn">
                    <span className="icon">🌳</span>
                    <span>Xin thu hoạch</span>
                </Link>
                <Link to="/" className="quick-action-btn">
                    <span className="icon">🏠</span>
                    <span>Trang chủ</span>
                </Link>
            </div>

            {/* Form thêm mới */}
            {showForm && (
                <div className="section">
                    <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <div className="card-header">
                            <h3 className="card-title">
                                <span className="icon">➕</span>
                                Thêm hoạt động mới
                            </h3>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                                    Loại hoạt động
                                </label>
                                <select
                                    value={formData.activityType}
                                    onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        border: '1px solid var(--glass-border)',
                                        background: 'rgba(255,255,255,0.1)',
                                        color: 'white',
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    {activityTypes.map(type => (
                                        <option key={type.value} value={type.value} style={{ background: '#1a1a3e' }}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {(formData.activityType === 'Fertilizing' || formData.activityType === 'Pesticide') && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                                        Tên sản phẩm sử dụng
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.productUsed}
                                        onChange={(e) => setFormData({ ...formData, productUsed: e.target.value })}
                                        placeholder="VD: NPK 20-20-15, Thuốc trừ sâu ABC..."
                                        style={{
                                            width: '100%',
                                            padding: '1rem',
                                            borderRadius: '12px',
                                            border: '1px solid var(--glass-border)',
                                            background: 'rgba(255,255,255,0.1)',
                                            color: 'white',
                                            fontSize: '1.1rem'
                                        }}
                                    />
                                </div>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                                        Số lượng
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                        placeholder="0"
                                        style={{
                                            width: '100%',
                                            padding: '1rem',
                                            borderRadius: '12px',
                                            border: '1px solid var(--glass-border)',
                                            background: 'rgba(255,255,255,0.1)',
                                            color: 'white',
                                            fontSize: '1.1rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                                        Đơn vị
                                    </label>
                                    <select
                                        value={formData.unit}
                                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '1rem',
                                            borderRadius: '12px',
                                            border: '1px solid var(--glass-border)',
                                            background: 'rgba(255,255,255,0.1)',
                                            color: 'white',
                                            fontSize: '1.1rem'
                                        }}
                                    >
                                        <option value="kg" style={{ background: '#1a1a3e' }}>kg</option>
                                        <option value="lít" style={{ background: '#1a1a3e' }}>lít</option>
                                        <option value="ml" style={{ background: '#1a1a3e' }}>ml</option>
                                        <option value="gói" style={{ background: '#1a1a3e' }}>gói</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                                    Ghi chú
                                </label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Mô tả thêm..."
                                    rows={3}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        border: '1px solid var(--glass-border)',
                                        background: 'rgba(255,255,255,0.1)',
                                        color: 'white',
                                        fontSize: '1.1rem',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>

                            <div className="btn-group">
                                <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 1 }}>
                                    ✅ Lưu hoạt động
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Cảnh báo phun thuốc */}
            {logs.some(log => log.activityType === 'Pesticide') && (
                <div className="section">
                    <div className="glass-card" style={{
                        borderColor: 'rgba(255, 152, 0, 0.5)',
                        background: 'linear-gradient(145deg, rgba(255, 152, 0, 0.15), rgba(255, 193, 7, 0.05))'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '2.5rem' }}>⚠️</span>
                            <div>
                                <h3 style={{ color: '#FFD54F', margin: 0, fontSize: '1.3rem' }}>Lưu ý thời gian cách ly</h3>
                                <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0' }}>
                                    Bạn đã phun thuốc BVTV. Cần đảm bảo đủ <strong style={{ color: '#FFF59D' }}>7-14 ngày cách ly</strong> trước khi thu hoạch.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Lịch sử hoạt động */}
            <div className="section">
                <div className="section-header">
                    <h2 className="section-title">
                        <span>📋</span> Lịch sử hoạt động
                    </h2>
                </div>

                {logs.length === 0 ? (
                    <div className="empty-state">
                        <div className="icon">📝</div>
                        <h3>Chưa có hoạt động nào</h3>
                        <p>Nhấn "Thêm hoạt động" để bắt đầu ghi nhật ký canh tác</p>
                    </div>
                ) : (
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        {logs.map((log, index) => {
                            const activity = activityTypes.find(t => t.value === log.activityType);
                            return (
                                <div
                                    key={log.id}
                                    className="glass-card"
                                    style={{
                                        marginBottom: '1rem',
                                        borderLeft: `4px solid ${activity?.color || '#4CAF50'}`,
                                        animationDelay: `${index * 0.1}s`
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--text-primary)' }}>
                                                {activity?.label}
                                            </h3>
                                            {log.productUsed && (
                                                <p style={{ margin: '0.5rem 0 0', color: 'var(--text-secondary)' }}>
                                                    Sản phẩm: <strong>{log.productUsed}</strong>
                                                </p>
                                            )}
                                            {log.quantity && (
                                                <p style={{ margin: '0.3rem 0 0', color: 'var(--text-muted)' }}>
                                                    Số lượng: {log.quantity} {log.unit}
                                                </p>
                                            )}
                                            {log.notes && (
                                                <p style={{ margin: '0.5rem 0 0', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                                    "{log.notes}"
                                                </p>
                                            )}
                                        </div>
                                        <span style={{
                                            color: 'var(--text-muted)',
                                            fontSize: '0.95rem',
                                            background: 'rgba(255,255,255,0.1)',
                                            padding: '0.3rem 0.8rem',
                                            borderRadius: '8px'
                                        }}>
                                            {formatDate(log.timestamp)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FarmingLogPage;
