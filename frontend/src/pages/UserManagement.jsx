import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/admin.css';

const API_BASE = 'http://localhost:5000/api';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [stats, setStats] = useState({ total: 0, byRole: {} });

    useEffect(() => {
        fetchUsers();
        fetchStats();
    }, [filterRole]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const url = filterRole 
                ? `${API_BASE}/users?role=${filterRole}`
                : `${API_BASE}/users`;
            const res = await fetch(url);
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error('Error fetching users:', err);
        }
        setLoading(false);
    };

    const fetchStats = async () => {
        try {
            const res = await fetch(`${API_BASE}/users/stats`);
            const data = await res.json();
            setStats(data);
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    const handleChangeRole = async (userId, newRole) => {
        try {
            const res = await fetch(`${API_BASE}/users/${userId}/role`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole })
            });
            if (res.ok) {
                fetchUsers();
                fetchStats();
            }
        } catch (err) {
            console.error('Error changing role:', err);
        }
    };

    const handleDelete = async (userId) => {
        if (!confirm('Bạn có chắc muốn xóa người dùng này?')) return;
        try {
            const res = await fetch(`${API_BASE}/users/${userId}`, { method: 'DELETE' });
            if (res.ok) {
                fetchUsers();
                fetchStats();
            } else {
                const error = await res.json();
                alert(error.message);
            }
        } catch (err) {
            console.error('Error deleting user:', err);
        }
    };

    const filteredUsers = users.filter(u =>
        u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone?.includes(searchTerm)
    );

    const getRoleColor = (role) => {
        switch (role) {
            case 'Admin': return { bg: 'rgba(156, 39, 176, 0.2)', color: '#CE93D8' };
            case 'Trader': return { bg: 'rgba(33, 150, 243, 0.2)', color: '#64B5F6' };
            case 'Farmer': return { bg: 'rgba(76, 175, 80, 0.2)', color: '#81C784' };
            default: return { bg: 'rgba(158, 158, 158, 0.2)', color: '#BDBDBD' };
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'Admin': return '👑';
            case 'Trader': return '🚛';
            case 'Farmer': return '👨‍🌾';
            default: return '👤';
        }
    };

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
                    <Link to="/admin/chemicals" className="sidebar-item">
                        <span className="sidebar-icon">💊</span>
                        <span className="sidebar-label">Thuốc BVTV</span>
                    </Link>
                    <Link to="/admin/users" className="sidebar-item active">
                        <span className="sidebar-icon">👥</span>
                        <span className="sidebar-label">Người dùng</span>
                    </Link>
                </nav>
            </aside>

            <main className="admin-main">
                <header className="admin-navbar">
                    <div className="navbar-left">
                        <h1 className="page-title">👥 Quản lý Người dùng</h1>
                    </div>
                </header>

                <div className="admin-content">
                    {/* Stats */}
                    <div className="stats-row" style={{ marginBottom: '1.5rem' }}>
                        <div 
                            className="stat-card" 
                            style={{ 
                                background: 'rgba(76, 175, 80, 0.15)', 
                                borderColor: '#4CAF50',
                                cursor: 'pointer',
                                border: filterRole === 'Farmer' ? '2px solid #4CAF50' : undefined
                            }}
                            onClick={() => setFilterRole(filterRole === 'Farmer' ? '' : 'Farmer')}
                        >
                            <div className="stat-info">
                                <span className="stat-label">Nông dân</span>
                                <span className="stat-value" style={{ color: '#4CAF50' }}>
                                    {stats.byRole?.Farmers || 0}
                                </span>
                            </div>
                            <span className="stat-icon">👨‍🌾</span>
                        </div>
                        <div 
                            className="stat-card" 
                            style={{ 
                                background: 'rgba(33, 150, 243, 0.15)', 
                                borderColor: '#2196F3',
                                cursor: 'pointer',
                                border: filterRole === 'Trader' ? '2px solid #2196F3' : undefined
                            }}
                            onClick={() => setFilterRole(filterRole === 'Trader' ? '' : 'Trader')}
                        >
                            <div className="stat-info">
                                <span className="stat-label">Thương lái</span>
                                <span className="stat-value" style={{ color: '#2196F3' }}>
                                    {stats.byRole?.Traders || 0}
                                </span>
                            </div>
                            <span className="stat-icon">🚛</span>
                        </div>
                        <div 
                            className="stat-card" 
                            style={{ 
                                background: 'rgba(156, 39, 176, 0.15)', 
                                borderColor: '#9C27B0',
                                cursor: 'pointer',
                                border: filterRole === 'Admin' ? '2px solid #9C27B0' : undefined
                            }}
                            onClick={() => setFilterRole(filterRole === 'Admin' ? '' : 'Admin')}
                        >
                            <div className="stat-info">
                                <span className="stat-label">Admin</span>
                                <span className="stat-value" style={{ color: '#9C27B0' }}>
                                    {stats.byRole?.Admins || 0}
                                </span>
                            </div>
                            <span className="stat-icon">👑</span>
                        </div>
                        <div className="stat-card" style={{ background: 'rgba(255, 255, 255, 0.05)', borderColor: '#9e9e9e' }}>
                            <div className="stat-info">
                                <span className="stat-label">Tổng cộng</span>
                                <span className="stat-value" style={{ color: 'white' }}>
                                    {stats.total || 0}
                                </span>
                            </div>
                            <span className="stat-icon">👥</span>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="table-section">
                        <div className="table-header">
                            <h2 className="table-title">
                                📋 Danh sách người dùng
                                {filterRole && (
                                    <span style={{ 
                                        marginLeft: '0.5rem', 
                                        fontSize: '0.9rem',
                                        background: 'rgba(255,255,255,0.1)',
                                        padding: '0.3rem 0.8rem',
                                        borderRadius: '20px'
                                    }}>
                                        {getRoleIcon(filterRole)} {filterRole}
                                        <button 
                                            onClick={() => setFilterRole('')}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: 'white',
                                                marginLeft: '0.5rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </span>
                                )}
                            </h2>
                            <div className="table-search">
                                <input
                                    type="text"
                                    placeholder="🔍 Tìm theo tên, username, SĐT..."
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
                                            <th>Người dùng</th>
                                            <th>Username</th>
                                            <th>Liên hệ</th>
                                            <th>Role</th>
                                            <th>Thống kê</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                                                    Không tìm thấy người dùng
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredUsers.map((user) => {
                                                const roleStyle = getRoleColor(user.role);
                                                return (
                                                    <tr key={user.userID}>
                                                        <td>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                                                <span style={{ 
                                                                    fontSize: '1.8rem',
                                                                    width: '45px',
                                                                    height: '45px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    background: roleStyle.bg,
                                                                    borderRadius: '12px'
                                                                }}>
                                                                    {getRoleIcon(user.role)}
                                                                </span>
                                                                <div>
                                                                    <strong style={{ color: 'var(--color-text-main)' }}>
                                                                        {user.fullName || 'N/A'}
                                                                    </strong>
                                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                                        ID: {user.userID}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td><code>{user.username}</code></td>
                                                        <td>
                                                            {user.phone && <div>📱 {user.phone}</div>}
                                                            {user.email && (
                                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                                    ✉️ {user.email}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <select
                                                                value={user.role}
                                                                onChange={(e) => handleChangeRole(user.userID, e.target.value)}
                                                                style={{
                                                                    background: roleStyle.bg,
                                                                    color: roleStyle.color,
                                                                    border: 'none',
                                                                    padding: '0.4rem 0.8rem',
                                                                    borderRadius: '6px',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                <option value="Farmer">👨‍🌾 Farmer</option>
                                                                <option value="Trader">🚛 Trader</option>
                                                                <option value="Admin">👑 Admin</option>
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <div style={{ fontSize: '0.9rem' }}>
                                                                {user.farmCount > 0 && (
                                                                    <span style={{ marginRight: '0.5rem' }}>
                                                                        🌳 {user.farmCount} farm
                                                                    </span>
                                                                )}
                                                                {user.requestCount > 0 && (
                                                                    <span>📋 {user.requestCount} req</span>
                                                                )}
                                                                {!user.farmCount && !user.requestCount && '-'}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="action-buttons">
                                                                <Link 
                                                                    to={`/admin/users/${user.userID}`} 
                                                                    className="btn-view"
                                                                    title="Xem chi tiết"
                                                                >
                                                                    👁️
                                                                </Link>
                                                                <button 
                                                                    className="btn-view" 
                                                                    title="Xóa"
                                                                    onClick={() => handleDelete(user.userID)}
                                                                    style={{ background: '#f44336' }}
                                                                >
                                                                    🗑️
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
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

export default UserManagement;
