import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/admin.css';

const API_BASE = 'http://localhost:5000/api';

const ChemicalManagement = () => {
    const [chemicals, setChemicals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        chemicalName: '',
        activeIngredient: '',
        phi_Days: 14,
        isBanned: false,
        targetMarket: ''
    });

    // Fetch chemicals
    useEffect(() => {
        fetchChemicals();
    }, []);

    const fetchChemicals = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/chemicals`);
            const data = await res.json();
            setChemicals(data);
        } catch (err) {
            console.error('Error fetching chemicals:', err);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingId 
                ? `${API_BASE}/chemicals/${editingId}`
                : `${API_BASE}/chemicals`;
            
            const res = await fetch(url, {
                method: editingId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                fetchChemicals();
                resetForm();
            }
        } catch (err) {
            console.error('Error saving chemical:', err);
        }
    };

    const handleEdit = (chem) => {
        setEditingId(chem.chemicalID);
        setFormData({
            chemicalName: chem.chemicalName,
            activeIngredient: chem.activeIngredient || '',
            phi_Days: chem.phi_Days,
            isBanned: chem.isBanned,
            targetMarket: chem.targetMarket || ''
        });
        setShowForm(true);
    };

    const handleBan = async (id, currentStatus) => {
        try {
            const endpoint = currentStatus ? 'unban' : 'ban';
            await fetch(`${API_BASE}/chemicals/${id}/${endpoint}`, { method: 'POST' });
            fetchChemicals();
        } catch (err) {
            console.error('Error toggling ban:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa thuốc này?')) return;
        try {
            await fetch(`${API_BASE}/chemicals/${id}`, { method: 'DELETE' });
            fetchChemicals();
        } catch (err) {
            console.error('Error deleting:', err);
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({
            chemicalName: '',
            activeIngredient: '',
            phi_Days: 14,
            isBanned: false,
            targetMarket: ''
        });
    };

    const filteredChemicals = chemicals.filter(c =>
        c.chemicalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.activeIngredient && c.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <span className="sidebar-logo">🍈</span>
                    <span className="sidebar-title">DurianQR Admin</span>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/admin" className="sidebar-item">
                        <span className="sidebar-icon">📊</span>
                        <span className="sidebar-label">Dashboard</span>
                    </Link>
                    <Link to="/admin/chemicals" className="sidebar-item active">
                        <span className="sidebar-icon">💊</span>
                        <span className="sidebar-label">Thuốc BVTV</span>
                    </Link>
                    <Link to="/admin/users" className="sidebar-item">
                        <span className="sidebar-icon">👥</span>
                        <span className="sidebar-label">Người dùng</span>
                    </Link>
                </nav>
            </aside>

            <main className="admin-main">
                <header className="admin-navbar">
                    <div className="navbar-left">
                        <h1 className="page-title">💊 Quản lý Thuốc BVTV</h1>
                    </div>
                    <div className="navbar-right">
                        <button 
                            onClick={() => setShowForm(!showForm)}
                            style={{
                                background: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                padding: '0.8rem 1.5rem',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}
                        >
                            ➕ Thêm thuốc
                        </button>
                    </div>
                </header>

                <div className="admin-content">
                    {/* Add/Edit Form */}
                    {showForm && (
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            marginBottom: '1.5rem',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <h3 style={{ margin: '0 0 1rem', color: 'var(--color-text-main)' }}>
                                {editingId ? '✏️ Chỉnh sửa thuốc' : '➕ Thêm thuốc mới'}
                            </h3>
                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                                            Tên thuốc *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.chemicalName}
                                            onChange={(e) => setFormData({...formData, chemicalName: e.target.value})}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '0.8rem',
                                                borderRadius: '8px',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                background: 'rgba(255,255,255,0.1)',
                                                color: 'white'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                                            Hoạt chất
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.activeIngredient}
                                            onChange={(e) => setFormData({...formData, activeIngredient: e.target.value})}
                                            style={{
                                                width: '100%',
                                                padding: '0.8rem',
                                                borderRadius: '8px',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                background: 'rgba(255,255,255,0.1)',
                                                color: 'white'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                                            PHI (ngày) *
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.phi_Days}
                                            onChange={(e) => setFormData({...formData, phi_Days: parseInt(e.target.value)})}
                                            min="0"
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '0.8rem',
                                                borderRadius: '8px',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                background: 'rgba(255,255,255,0.1)',
                                                color: 'white'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                                            Thị trường mục tiêu
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.targetMarket}
                                            onChange={(e) => setFormData({...formData, targetMarket: e.target.value})}
                                            placeholder="VN, CN, EU..."
                                            style={{
                                                width: '100%',
                                                padding: '0.8rem',
                                                borderRadius: '8px',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                background: 'rgba(255,255,255,0.1)',
                                                color: 'white'
                                            }}
                                        />
                                    </div>
                                </div>
                                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                                    <button type="submit" style={{
                                        background: '#4CAF50',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.8rem 2rem',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}>
                                        {editingId ? '💾 Cập nhật' : '✅ Thêm mới'}
                                    </button>
                                    <button type="button" onClick={resetForm} style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        color: 'white',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        padding: '0.8rem 2rem',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}>
                                        Hủy
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="stats-row" style={{ marginBottom: '1.5rem' }}>
                        <div className="stat-card" style={{ background: 'rgba(76, 175, 80, 0.15)', borderColor: '#4CAF50' }}>
                            <div className="stat-info">
                                <span className="stat-label">Tổng thuốc</span>
                                <span className="stat-value" style={{ color: '#4CAF50' }}>{chemicals.length}</span>
                            </div>
                            <span className="stat-icon">💊</span>
                        </div>
                        <div className="stat-card" style={{ background: 'rgba(244, 67, 54, 0.15)', borderColor: '#f44336' }}>
                            <div className="stat-info">
                                <span className="stat-label">Đã cấm</span>
                                <span className="stat-value" style={{ color: '#f44336' }}>
                                    {chemicals.filter(c => c.isBanned).length}
                                </span>
                            </div>
                            <span className="stat-icon">⛔</span>
                        </div>
                        <div className="stat-card" style={{ background: 'rgba(255, 152, 0, 0.15)', borderColor: '#FF9800' }}>
                            <div className="stat-info">
                                <span className="stat-label">PHI ≥ 14 ngày</span>
                                <span className="stat-value" style={{ color: '#FF9800' }}>
                                    {chemicals.filter(c => c.phi_Days >= 14).length}
                                </span>
                            </div>
                            <span className="stat-icon">⚠️</span>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="table-section">
                        <div className="table-header">
                            <h2 className="table-title">📋 Danh sách thuốc BVTV</h2>
                            <div className="table-search">
                                <input
                                    type="text"
                                    placeholder="🔍 Tìm kiếm..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="table-container">
                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '3rem' }}>⏳ Đang tải...</div>
                            ) : (
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Tên thuốc</th>
                                            <th>Hoạt chất</th>
                                            <th>PHI (ngày)</th>
                                            <th>Thị trường</th>
                                            <th>Trạng thái</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredChemicals.map((chem) => (
                                            <tr key={chem.chemicalID} style={{ opacity: chem.isBanned ? 0.6 : 1 }}>
                                                <td>
                                                    <strong>{chem.chemicalName}</strong>
                                                </td>
                                                <td>{chem.activeIngredient || '-'}</td>
                                                <td>
                                                    <span style={{
                                                        background: chem.phi_Days >= 14 ? 'rgba(255,152,0,0.2)' : 'rgba(76,175,80,0.2)',
                                                        color: chem.phi_Days >= 14 ? '#FFD54F' : '#81C784',
                                                        padding: '0.3rem 0.6rem',
                                                        borderRadius: '6px'
                                                    }}>
                                                        {chem.phi_Days} ngày
                                                    </span>
                                                </td>
                                                <td>{chem.targetMarket || 'VN'}</td>
                                                <td>
                                                    <span className={`status-badge ${chem.isBanned ? 'warning' : 'safe'}`}>
                                                        {chem.isBanned ? '⛔ Đã cấm' : '✅ Cho phép'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button 
                                                            className="btn-edit" 
                                                            title="Sửa"
                                                            onClick={() => handleEdit(chem)}
                                                        >
                                                            ✏️
                                                        </button>
                                                        <button 
                                                            className="btn-view" 
                                                            title={chem.isBanned ? 'Gỡ cấm' : 'Cấm'}
                                                            onClick={() => handleBan(chem.chemicalID, chem.isBanned)}
                                                            style={{ background: chem.isBanned ? '#4CAF50' : '#f44336' }}
                                                        >
                                                            {chem.isBanned ? '✅' : '⛔'}
                                                        </button>
                                                        <button 
                                                            className="btn-view" 
                                                            title="Xóa"
                                                            onClick={() => handleDelete(chem.chemicalID)}
                                                            style={{ background: '#9e9e9e' }}
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ChemicalManagement;
