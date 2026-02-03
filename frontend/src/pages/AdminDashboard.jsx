import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/admin.css';

const AdminDashboard = () => {
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Get current date in Vietnamese format
    const currentDate = new Date().toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const menuItems = [
        { path: '/admin', icon: '📊', label: 'Dashboard' },
        { path: '/admin/farmers', icon: '👨‍🌾', label: 'Nông dân' },
        { path: '/admin/plots', icon: '🗺️', label: 'Vùng trồng' },
        { path: '/admin/logs', icon: '📝', label: 'Nhật ký canh tác' },
        { path: '/admin/batches', icon: '📦', label: 'Lô xuất khẩu' },
        { path: '/admin/qr', icon: '🔲', label: 'Quản lý QR' },
    ];

    const navItems = [
        { path: '/admin', icon: '📊', label: 'Tổng quan' },
        { path: '/admin/farmers', icon: '👨‍🌾', label: 'Nông dân' },
        { path: '/admin/plots', icon: '🗺️', label: 'Vùng trồng' },
        { path: '/admin/logs', icon: '📝', label: 'Nhật ký' },
        { path: '/admin/batches', icon: '📦', label: 'Lô hàng' },
        { path: '/admin/qr', icon: '🔲', label: 'Mã QR' },
    ];

    const stats = [
        { label: 'Tổng Nông dân', value: '156', icon: '👨‍🌾' },
        { label: 'Vùng trồng', value: '42', icon: '🗺️' },
        { label: 'Cảnh báo', value: '7', icon: '⚠️' },
        { label: 'Sản lượng (tấn)', value: '234', icon: '🍈' },
    ];

    const sidebarStats = [
        { label: 'Lô đang xử lý', value: '12' },
        { label: 'Chờ duyệt', value: '5' },
        { label: 'Hoàn thành hôm nay', value: '8' },
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
        <div className="admin-layout">
            {/* Top Header with Logo */}
            <header className="admin-top-header">
                <div className="admin-logo-bar">
                    <div className="logo-section">
                        <span className="logo-icon">🍈</span>
                        <span className="logo-text">Durian<span>QR</span></span>
                    </div>
                    <div className="header-actions">
                        <span className="header-date">{currentDate}</span>
                        <div className="header-search">
                            <span>🔍</span>
                            <input type="text" placeholder="Tìm kiếm..." />
                        </div>
                        <div className="header-user">
                            <span className="user-avatar">👤</span>
                            <span className="user-name">Admin</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Top Navigation Bar */}
            <nav className="admin-top-nav">
                <div className="nav-container">
                    <div className="nav-links">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Header Banner */}
            <section className="admin-banner">
                <div className="banner-content">
                    <h1 className="banner-title">Bảng điều khiển Quản trị</h1>
                    <p className="banner-subtitle">Hệ thống truy xuất nguồn gốc sầu riêng - DurianQR</p>
                </div>
            </section>

            {/* Main Body: Sidebar + Content */}
            <div className="admin-body">
                {/* Sidebar */}
                <aside className="admin-sidebar">
                    <div className="sidebar-section">
                        <h3 className="sidebar-section-title">Menu</h3>
                        <nav className="sidebar-nav">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
                                >
                                    <span className="sidebar-icon">{item.icon}</span>
                                    <span className="sidebar-label">{item.label}</span>
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="sidebar-section">
                        <h3 className="sidebar-section-title">Thống kê nhanh</h3>
                        <div className="sidebar-stats">
                            {sidebarStats.map((stat, index) => (
                                <div key={index} className="sidebar-stat">
                                    <span className="sidebar-stat-label">{stat.label}</span>
                                    <span className="sidebar-stat-value">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="admin-main">
                    <div className="admin-content">
                        {/* Stats Cards */}
                        <div className="stats-row">
                            {stats.map((stat, index) => (
                                <div key={index} className="stat-card">
                                    <div className="stat-info">
                                        <span className="stat-label">{stat.label}</span>
                                        <span className="stat-value">{stat.value}</span>
                                    </div>
                                    <span className="stat-icon">{stat.icon}</span>
                                </div>
                            ))}
                        </div>

                        {/* Recent Logs Table */}
                        <div className="table-section">
                            <div className="table-header">
                                <h2 className="table-title">
                                    <span className="table-title-icon">📝</span>
                                    Nhật ký canh tác gần đây
                                </h2>
                                <div className="table-actions">
                                    <div className="table-search">
                                        <input
                                            type="text"
                                            placeholder="Tìm theo tên nông dân..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <button className="btn-export">
                                        <span>📥</span>
                                        Xuất Excel
                                    </button>
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
                                                        {log.status === 'safe' ? '✓ An toàn' : '⚠ Cảnh báo'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button title="Xem chi tiết">👁️</button>
                                                        <button title="Chỉnh sửa">✏️</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="pagination">
                                <button className="page-btn" disabled>← Trước</button>
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
                                <button className="page-btn">Sau →</button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Footer */}
            <footer className="admin-footer">
                <div className="footer-content">
                    <span className="footer-text">© 2026 DurianQR - Hệ thống truy xuất nguồn gốc sầu riêng</span>
                    <div className="footer-links">
                        <Link to="/guide" className="footer-link">Hướng dẫn</Link>
                        <Link to="/trace" className="footer-link">Tra cứu</Link>
                        <a href="mailto:support@durianqr.vn" className="footer-link">Hỗ trợ</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AdminDashboard;
