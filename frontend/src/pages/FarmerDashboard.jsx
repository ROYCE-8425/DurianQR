import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import SharedHeader, { SharedFooter } from '../components/SharedHeader';
import '../styles/shared-header.css';

const FarmerDashboard = () => {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        farms: 0,
        trees: 0,
        activities: 0,
        harvestRequests: 0
    });
    const [recentActivities, setRecentActivities] = useState([]);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [farmsRes, logsRes] = await Promise.all([
                api.get('/farms'),
                api.get('/farming-logs')
            ]);

            const farms = farmsRes.data;
            const totalTrees = farms.reduce((sum, farm) => sum + (farm.trees?.length || 0), 0);
            const logs = logsRes.data.slice(0, 5);

            // Check for PHI warnings
            const phiAlerts = logs.filter(log =>
                log.activityType === 'Pesticide' &&
                log.phiDaysRemaining > 0
            );

            setStats({
                farms: farms.length,
                trees: totalTrees,
                activities: logsRes.data.length,
                harvestRequests: 0
            });

            setRecentActivities(logs);
            setAlerts(phiAlerts.map(log => ({
                type: 'warning',
                message: `⚠️ Cây ${log.treeCode}: Còn ${log.phiDaysRemaining} ngày cách ly sau phun ${log.chemicalUsed}`
            })));
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    if (loading) {
        return (
            <div className="shared-page-layout">
                <SharedHeader
                    title="Dashboard Nông dân"
                    subtitle="Đang tải dữ liệu..."
                    bannerIcon="👨‍🌾"
                    navType="farmer"
                />
                <div style={styles.loadingContainer}>
                    <div style={styles.spinner}></div>
                    <p>Đang tải...</p>
                </div>
                <SharedFooter />
            </div>
        );
    }

    return (
        <div className="shared-page-layout">
            <SharedHeader
                title={`Xin chào, ${user?.fullName || 'Nông dân'}!`}
                subtitle="Quản lý nông trại và theo dõi canh tác"
                bannerIcon="👨‍🌾"
                navType="farmer"
            />

            <div className="shared-page-body">
                {/* Sidebar */}
                <aside style={styles.sidebar}>
                    <nav style={styles.sidebarNav}>
                        <h3 style={styles.sidebarTitle}>📋 MENU</h3>
                        <Link to="/farmer" style={styles.sidebarLink}>🏠 Trang chủ</Link>
                        <Link to="/farming-log" style={styles.sidebarLink}>📝 Nhật ký canh tác</Link>
                        <Link to="/harvest-request" style={styles.sidebarLink}>🌳 Yêu cầu thu hoạch</Link>
                        <Link to="/trace" style={styles.sidebarLink}>🔍 Truy xuất nguồn gốc</Link>
                    </nav>

                    <div style={styles.sidebarStats}>
                        <h3 style={styles.sidebarTitle}>📊 THỐNG KÊ NHANH</h3>
                        <div style={styles.quickStat}>
                            <span>Nông trại</span>
                            <strong>{stats.farms}</strong>
                        </div>
                        <div style={styles.quickStat}>
                            <span>Số cây</span>
                            <strong>{stats.trees}</strong>
                        </div>
                        <div style={styles.quickStat}>
                            <span>Hoạt động</span>
                            <strong>{stats.activities}</strong>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="shared-page-main">
                    {/* Alerts */}
                    {alerts.length > 0 && (
                        <div style={styles.alertsContainer}>
                            {alerts.map((alert, index) => (
                                <div key={index} style={styles.alert}>
                                    {alert.message}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Stats Grid */}
                    <div style={styles.statsGrid}>
                        <div style={styles.statCard}>
                            <span style={styles.statIcon}>🏡</span>
                            <span style={styles.statValue}>{stats.farms}</span>
                            <span style={styles.statLabel}>Nông trại</span>
                        </div>
                        <div style={styles.statCard}>
                            <span style={styles.statIcon}>🌳</span>
                            <span style={styles.statValue}>{stats.trees}</span>
                            <span style={styles.statLabel}>Cây sầu riêng</span>
                        </div>
                        <div style={styles.statCard}>
                            <span style={styles.statIcon}>📝</span>
                            <span style={styles.statValue}>{stats.activities}</span>
                            <span style={styles.statLabel}>Hoạt động</span>
                        </div>
                        <div style={styles.statCard}>
                            <span style={styles.statIcon}>📋</span>
                            <span style={styles.statValue}>{stats.harvestRequests}</span>
                            <span style={styles.statLabel}>Yêu cầu thu hoạch</span>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <section style={styles.section}>
                        <h2 style={styles.sectionTitle}>⚡ Thao tác nhanh</h2>
                        <div style={styles.quickActions}>
                            <Link to="/farming-log" style={styles.actionCard}>
                                <span style={styles.actionIcon}>📝</span>
                                <span style={styles.actionLabel}>Ghi nhật ký canh tác</span>
                            </Link>
                            <Link to="/harvest-request" style={styles.actionCard}>
                                <span style={styles.actionIcon}>🌳</span>
                                <span style={styles.actionLabel}>Yêu cầu thu hoạch</span>
                            </Link>
                            <Link to="/trace" style={styles.actionCard}>
                                <span style={styles.actionIcon}>🔍</span>
                                <span style={styles.actionLabel}>Truy xuất nguồn gốc</span>
                            </Link>
                            <Link to="/guide" style={styles.actionCard}>
                                <span style={styles.actionIcon}>📖</span>
                                <span style={styles.actionLabel}>Hướng dẫn sử dụng</span>
                            </Link>
                        </div>
                    </section>

                    {/* Recent Activities */}
                    <section style={styles.section}>
                        <div style={styles.sectionHeader}>
                            <h2 style={styles.sectionTitle}>🕒 Hoạt động gần đây</h2>
                            <Link to="/farming-log" style={styles.viewAll}>Xem tất cả →</Link>
                        </div>

                        {recentActivities.length === 0 ? (
                            <div style={styles.emptyState}>
                                <span style={styles.emptyIcon}>📝</span>
                                <h3>Chưa có hoạt động nào</h3>
                                <p>Bắt đầu ghi nhật ký canh tác để theo dõi</p>
                            </div>
                        ) : (
                            <div style={styles.activityList}>
                                {recentActivities.map((activity, index) => (
                                    <div key={index} style={styles.activityCard}>
                                        <div style={styles.activityIcon}>
                                            {activity.activityType === 'Pesticide' ? '💊' :
                                                activity.activityType === 'Fertilizer' ? '🧪' :
                                                    activity.activityType === 'Watering' ? '💧' : '🌿'}
                                        </div>
                                        <div style={styles.activityContent}>
                                            <div style={styles.activityHeader}>
                                                <strong>{activity.activityType}</strong>
                                                <span style={styles.activityDate}>{formatDate(activity.date)}</span>
                                            </div>
                                            <p style={styles.activityDesc}>{activity.description}</p>
                                            {activity.treeCode && (
                                                <span style={styles.treeTag}>🌳 {activity.treeCode}</span>
                                            )}
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

const styles = {
    sidebar: {
        width: '260px',
        flexShrink: 0,
        background: '#ffffff',
        border: '1px solid #e5e5e5',
        borderRadius: '8px',
        padding: '1.5rem',
        height: 'fit-content',
    },
    sidebarNav: {
        marginBottom: '2rem',
    },
    sidebarTitle: {
        fontSize: '0.75rem',
        fontWeight: 700,
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '1rem',
    },
    sidebarLink: {
        display: 'block',
        padding: '0.75rem 1rem',
        marginBottom: '0.25rem',
        color: '#555',
        textDecoration: 'none',
        borderRadius: '4px',
        fontSize: '0.9rem',
        transition: 'all 0.2s ease',
    },
    sidebarStats: {},
    quickStat: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.75rem 0',
        borderBottom: '1px solid #f0f0f0',
        fontSize: '0.9rem',
        color: '#555',
    },
    alertsContainer: {
        marginBottom: '1.5rem',
    },
    alert: {
        padding: '1rem',
        background: '#fff3e0',
        border: '1px solid #ffcc80',
        borderRadius: '8px',
        color: '#e65100',
        marginBottom: '0.5rem',
        fontSize: '0.9rem',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        marginBottom: '2rem',
    },
    statCard: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '1.5rem 1rem',
        background: '#ffffff',
        border: '1px solid #e5e5e5',
        borderRadius: '8px',
        textAlign: 'center',
    },
    statIcon: { fontSize: '1.75rem' },
    statValue: { fontSize: '1.75rem', fontWeight: 700, color: '#1a1a1a' },
    statLabel: { fontSize: '0.7rem', fontWeight: 600, color: '#888', textTransform: 'uppercase' },
    section: { marginBottom: '2rem' },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid #e5e5e5',
    },
    sectionTitle: {
        fontSize: '1.1rem',
        fontWeight: 700,
        color: '#1a1a1a',
        margin: 0,
    },
    viewAll: {
        color: '#2d5a27',
        textDecoration: 'none',
        fontSize: '0.875rem',
        fontWeight: 600,
    },
    quickActions: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
    },
    actionCard: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '1.5rem 1rem',
        background: '#ffffff',
        border: '1px solid #e5e5e5',
        borderRadius: '8px',
        textDecoration: 'none',
        color: '#1a1a1a',
        transition: 'all 0.2s ease',
    },
    actionIcon: { fontSize: '2rem' },
    actionLabel: { fontSize: '0.8rem', fontWeight: 600, textAlign: 'center' },
    activityList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
    },
    activityCard: {
        display: 'flex',
        gap: '1rem',
        padding: '1rem',
        background: '#ffffff',
        border: '1px solid #e5e5e5',
        borderRadius: '8px',
    },
    activityIcon: {
        width: '40px',
        height: '40px',
        background: '#e8f5e9',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.25rem',
        flexShrink: 0,
    },
    activityContent: { flex: 1 },
    activityHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '0.25rem',
    },
    activityDate: {
        fontSize: '0.8rem',
        color: '#888',
    },
    activityDesc: {
        fontSize: '0.9rem',
        color: '#555',
        margin: '0 0 0.5rem',
    },
    treeTag: {
        display: 'inline-block',
        padding: '0.25rem 0.5rem',
        background: '#f0f0f0',
        borderRadius: '4px',
        fontSize: '0.75rem',
        color: '#555',
    },
    emptyState: {
        textAlign: 'center',
        padding: '3rem',
        background: '#ffffff',
        border: '1px solid #e5e5e5',
        borderRadius: '8px',
        color: '#888',
    },
    emptyIcon: { fontSize: '3rem', display: 'block', marginBottom: '1rem' },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        padding: '3rem',
        color: '#888',
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '3px solid #e5e5e5',
        borderTop: '3px solid #2d5a27',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '1rem',
    },
};

export default FarmerDashboard;
