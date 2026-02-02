import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/admin.css';

const AdminDashboard = () => {
    const location = useLocation();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const menuItems = [
        { path: '/admin', icon: '📊', label: 'Dashboard' },
        { path: '/admin/farmers', icon: '👨‍🌾', label: 'Nông dân' },
        { path: '/admin/plots', icon: '🗺️', label: 'Vùng trồng' },
        { path: '/admin/logs', icon: '📝', label: 'Nhật ký canh tác' },
        { path: '/admin/batches', icon: '📦', label: 'Lô xuất khẩu' },
        { path: '/admin/qr', icon: '🔲', label: 'Quản lý QR' },
    ];

    const stats = [
        { label: 'Tổng Nông dân', value: '156', icon: '👨‍🌾', color: '#4CAF50', bgColor: 'rgba(76, 175, 80, 0.15)' },
        { label: 'Vùng trồng hoạt động', value: '42', icon: '🗺️', color: '#2196F3', bgColor: 'rgba(33, 150, 243, 0.15)' },
        { label: 'Cảnh báo chờ xử lý', value: '7', icon: '⚠️', color: '#F44336', bgColor: 'rgba(244, 67, 54, 0.15)' },
        { label: 'Tổng sản lượng (tấn)', value: '234', icon: '🍈', color: '#FFC107', bgColor: 'rgba(255, 193, 7, 0.15)' },
    ];

    const recentLogs = [
        { id: 'LOG-001', farmer: 'Nguyễn Văn A', plot: 'Thửa A-01', activity: 'Phun thuốc BVTV', date: '02/02/2026', status: 'warning' },
        { id: 'LOG-002', farmer: 'Trần Thị B', plot: 'Thửa B-03', activity: 'Bón phân NPK', date: '02/02/2026', status: 'safe' },
        { id: 'LOG-003', farmer: 'Lê Văn C', plot: 'Thửa C-02', activity: 'Tưới nước', date: '01/02/2026', status: 'safe' },
        { id: 'LOG-004', farmer: 'Phạm Thị D', plot: 'Thửa D-01', activity: 'Phun thuốc Regent', date: '01/02/2026', status: 'warning' },
        { id: 'LOG-005', farmer: 'Hoàng Văn E', plot: 'Thửa E-04', activity: 'Tỉa cành', date: '31/01/2026', status: 'safe' },
        { id: 'LOG-006', farmer: 'Ngô Thị F', plot: 'Thửa F-02', activity: 'Thu hoạch', date: '30/01/2026', status: 'safe' },
    ];

    return (
        <div className={`admin-layout ${sidebarCollapsed ? 'collapsed' : ''}`}>
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <span className="sidebar-logo">🍈</span>
                    {!sidebarCollapsed && <span className="sidebar-title">DurianQR Admin</span>}
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <span className="sidebar-icon">{item.icon}</span>
                            {!sidebarCollapsed && <span className="sidebar-label">{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                <button className="sidebar-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
                    {sidebarCollapsed ? '➡️' : '⬅️'}
                </button>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                {/* Top Navbar */}
                <header className="admin-navbar">
                    <div className="navbar-left">
                        <h1 className="page-title">📊 Dashboard</h1>
                    </div>
                    <div className="navbar-right">
                        <div className="search-box">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                className="search-input"
                            />
                        </div>
                        <div className="notifications">
                            <span className="notif-icon">🔔</span>
                            <span className="notif-badge">3</span>
                        </div>
                        <div className="user-profile">
                            <span className="user-avatar">👤</span>
                            <span className="user-name">Admin</span>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="admin-content">
                    {/* Stats Cards */}
                    <div className="stats-row">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="stat-card"
                                style={{ background: stat.bgColor, borderColor: stat.color }}
                            >
                                <div className="stat-info">
                                    <span className="stat-label">{stat.label}</span>
                                    <span className="stat-value" style={{ color: stat.color }}>{stat.value}</span>
                                </div>
                                <span className="stat-icon">{stat.icon}</span>
                            </div>
                        ))}
                    </div>

                    {/* Recent Logs Table */}
                    <div className="table-section">
                        <div className="table-header">
                            <h2 className="table-title">📝 Nhật ký canh tác gần đây</h2>
                            <div className="table-actions">
                                <div className="table-search">
                                    <input
                                        type="text"
                                        placeholder="Tìm theo tên nông dân..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <button className="btn-export">📥 Xuất Excel</button>
                            </div>
                        </div>

                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Mã Log</th>
                                        <th>Nông dân</th>
                                        <th>Thửa đất</th>
                                        <th>Hoạt động</th>
                                        <th>Ngày</th>
                                        <th>Trạng thái</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentLogs.map((log) => (
                                        <tr key={log.id}>
                                            <td><code>{log.id}</code></td>
                                            <td>
                                                <div className="farmer-cell">
                                                    <span className="farmer-avatar">👨‍🌾</span>
                                                    {log.farmer}
                                                </div>
                                            </td>
                                            <td>{log.plot}</td>
                                            <td>{log.activity}</td>
                                            <td>{log.date}</td>
                                            <td>
                                                <span className={`status-badge ${log.status}`}>
                                                    {log.status === 'safe' ? '✅ An toàn' : '⚠️ Cảnh báo'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="btn-view" title="Xem chi tiết">👁️</button>
                                                    <button className="btn-edit" title="Chỉnh sửa">✏️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="pagination">
                            <button className="page-btn" disabled>⬅️ Trước</button>
                            <div className="page-numbers">
                                {[1, 2, 3, 4, 5].map((page) => (
                                    <button
                                        key={page}
                                        className={`page-num ${currentPage === page ? 'active' : ''}`}
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button className="page-btn">Sau ➡️</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
