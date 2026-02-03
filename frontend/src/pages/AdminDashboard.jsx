import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/admin.css';

const API_BASE = 'http://localhost:5000/api';

const AdminDashboard = () => {
    const location = useLocation();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    
    // Real data from API
    const [stats, setStats] = useState({
        totalFarmers: 0,
        totalFarms: 0,
        totalTrees: 0,
        pendingRequests: 0,
        approvedRequests: 0,
        batchesInWarehouse: 0,
        monthlyWeightKg: 0
    });
    const [recentLogs, setRecentLogs] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);

    const menuItems = [
        { path: '/admin', icon: '📊', label: 'Dashboard' },
        { path: '/admin/farmers', icon: '👨‍🌾', label: 'Nông dân' },
        { path: '/admin/plots', icon: 'Map', label: 'Vùng trồng' }, // Updated icon for compatibility
        { path: '/admin/logs', icon: '📝', label: 'Nhật ký' },
        { path: '/admin/batches', icon: '📦', label: 'Lô xuất khẩu' },
        { path: '/admin/qr', icon: '🔲', label: 'Quản lý QR' },
        { path: '/warehouse', icon: '🏭', label: 'Kho hàng' },
    ];

    // Fetch dashboard data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch users stats
                const usersRes = await fetch(`${API_BASE}/users/stats`);
                const usersData = usersRes.ok ? await usersRes.json() : null;
                
                // Fetch pending harvest requests
                const requestsRes = await fetch(`${API_BASE}/harvest-requests/pending`);
                const requestsData = requestsRes.ok ? await requestsRes.json() : [];
                
                // Fetch recent farming logs
                const logsRes = await fetch(`${API_BASE}/farminglogs`);
                const logsData = logsRes.ok ? await logsRes.json() : [];

                setStats({
                    totalFarmers: usersData?.byRole?.Farmers || 0,
                    traders: usersData?.byRole?.Traders || 0,
                    totalUsers: usersData?.total || 0,
                    pendingRequests: requestsData.length || 0,
                    monthlyLogs: logsData.filter(l => {
                        const logDate = new Date(l.logDate);
                        const now = new Date();
                        return logDate.getMonth() === now.getMonth();
                    }).length
                });
                
                setPendingRequests(requestsData.slice(0, 5));
                setRecentLogs(logsData.slice(0, 6));
            } catch (err) {
                console.log('Could not fetch dashboard data');
            }
            setLoading(false);
        };
        
        fetchData();
    }, []);

    const statCards = [
        { label: 'Tổng Nông dân', value: stats.totalFarmers, icon: '👨‍🌾', type: 'success' },
        { label: 'Thương lái', value: stats.traders || 0, icon: '🚛', type: 'info' },
        { label: 'Yêu cầu chờ duyệt', value: stats.pendingRequests, icon: '⏳', type: 'warning' },
        { label: 'Nhật ký tháng này', value: stats.monthlyLogs || 0, icon: '📝', type: 'purple' },
    ];

    const getActivityIcon = (type) => {
        const icons = {
            'Spraying': '🐛',
            'Fertilizing': '🧪',
            'Watering': '💧',
            'Pruning': '✂️',
            'Flowering': '🌸',
            'Other': '📝'
        };
        return icons[type] || '📝';
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('vi-VN');
    };

    return (
        <div className={`admin-layout ${sidebarCollapsed ? 'collapsed' : ''}`}>
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <span className="sidebar-logo">🍈</span>
                    {!sidebarCollapsed && <span className="sidebar-title">Admin</span>}
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
                <header className="admin-header">
                    <div className="header-left">
                        <h1 className="page-title">Tổng quan</h1>
                    </div>
                    <div className="header-right">
                        <div className="search-box">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="notifications">
                            <span className="notif-icon-btn">🔔</span>
                            {stats.pendingRequests > 0 && (
                                <span className="notif-badge">{stats.pendingRequests}</span>
                            )}
                        </div>
                        <div className="user-profile">
                            <div className="user-avatar">AD</div>
                            <span className="user-name">Quản trị viên</span>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="admin-content">
                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Đang tải dữ liệu...</p>
                        </div>
                    ) : (
                        <>
                            {/* Stats Cards */}
                            <div className="admin-stats-grid">
                                {statCards.map((stat, index) => (
                                    <div key={index} className={`stat-card type-${stat.type}`}>
                                        <div className="stat-info">
                                            <span className="stat-label">{stat.label}</span>
                                            <span className="stat-value">{stat.value}</span>
                                        </div>
                                        <span className="stat-icon">{stat.icon}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Charts & Requests */}
                            <div className="dashboard-grid">
                                {/* Activity Chart - Now using pure CSS bars */}
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">📈 Hoạt động canh tác</h3>
                                    </div>
                                    <div className="card-body">
                                        <div className="activity-list">
                                            {[
                                                { label: 'Phun thuốc', count: recentLogs.filter(l => l.activityType === 'Spraying').length, color: 'var(--color-warning)', max: 10 },
                                                { label: 'Bón phân', count: recentLogs.filter(l => l.activityType === 'Fertilizing').length, color: 'var(--color-success)', max: 10 },
                                                { label: 'Tưới nước', count: recentLogs.filter(l => l.activityType === 'Watering').length, color: 'var(--color-info)', max: 10 },
                                                { label: 'Tỉa cành', count: recentLogs.filter(l => l.activityType === 'Pruning').length, color: 'var(--color-purple)', max: 10 },
                                            ].map((item, i) => (
                                                <div key={i} className="activity-item">
                                                    <div className="activity-label">
                                                        <span>{item.label}</span>
                                                        <span className="activity-count">{item.count}</span>
                                                    </div>
                                                    <div className="progress-bar">
                                                        <div 
                                                            className="progress-fill" 
                                                            style={{ 
                                                                width: `${Math.min((item.count / item.max) * 100, 100)}%`,
                                                                backgroundColor: item.color
                                                            }} 
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Pending Requests */}
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">⏳ Yêu cầu chờ duyệt</h3>
                                    </div>
                                    <div className="card-body">
                                        {pendingRequests.length === 0 ? (
                                            <div className="empty-state-small">
                                                <span>✅</span>
                                                <p>Tất cả yêu cầu đã được xử lý</p>
                                            </div>
                                        ) : (
                                            <div className="request-list">
                                                {pendingRequests.map((req, i) => (
                                                    <div key={i} className="request-item">
                                                        <div className="request-info">
                                                            <div className="request-code">{req.requestCode}</div>
                                                            <div className="request-detail">
                                                                {req.tree?.treeCode || 'Cây'} • {req.estimatedQuantity}kg
                                                            </div>
                                                        </div>
                                                        <Link to={`/harvest-request/${req.requestID}`} className="btn btn-sm btn-action">
                                                            Xem
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Recent Logs Table */}
                            <div className="card">
                                <div className="card-header flex justify-between items-center">
                                    <h2 className="card-title">📝 Nhật ký gần đây</h2>
                                    <Link to="/admin/logs" className="btn btn-link">Xem tất cả</Link>
                                </div>
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Ngày</th>
                                                <th>Cây</th>
                                                <th>Hoạt động</th>
                                                <th>Sản phẩm</th>
                                                <th>Số lượng</th>
                                                <th>Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentLogs.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="text-center py-4">
                                                        Chưa có dữ liệu nhật ký
                                                    </td>
                                                </tr>
                                            ) : (
                                                recentLogs.map((log) => (
                                                    <tr key={log.logID}>
                                                        <td>{formatDate(log.logDate)}</td>
                                                        <td><span className="badge badge-outline">{log.tree?.treeCode || `#${log.treeID}`}</span></td>
                                                        <td>
                                                            <span className="flex items-center gap-2">
                                                                {getActivityIcon(log.activityType)} {log.activityType}
                                                            </span>
                                                        </td>
                                                        <td>{log.chemicalUsed || '-'}</td>
                                                        <td>{log.dosageAmount ? `${log.dosageAmount} ${log.unit}` : '-'}</td>
                                                        <td>
                                                            <span className={`badge ${log.safetyDays ? 'badge-warning' : 'badge-success'}`}>
                                                                {log.safetyDays ? `PHI ${log.safetyDays} ngày` : 'An toàn'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
