import { Link, useLocation } from 'react-router-dom';
import '../styles/shared-header.css';

/**
 * Shared Header Component - Newspaper Style Light Theme
 * Used across all pages for consistent navigation
 */
const SharedHeader = ({
    title = 'DurianQR',
    subtitle = 'Hệ thống truy xuất nguồn gốc sầu riêng',
    bannerIcon = '🍈',
    navType = 'public' // 'public', 'farmer', 'admin'
}) => {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));

    // Get current date in Vietnamese format
    const currentDate = new Date().toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Navigation items based on role
    const navConfigs = {
        public: [
            { path: '/', icon: '🏠', label: 'Trang chủ' },
            { path: '/trace', icon: '🔍', label: 'Truy xuất' },
            { path: '/guide', icon: '📖', label: 'Hướng dẫn' },
            { path: '/login', icon: '🔐', label: 'Đăng nhập' },
        ],
        farmer: [
            { path: '/farmer', icon: '🏠', label: 'Trang chủ' },
            { path: '/farming-log', icon: '📝', label: 'Nhật ký' },
            { path: '/harvest-request', icon: '🌳', label: 'Thu hoạch' },
            { path: '/trace', icon: '🔍', label: 'Truy xuất' },
        ],
        admin: [
            { path: '/admin', icon: '📊', label: 'Tổng quan' },
            { path: '/admin/farmers', icon: '👨‍🌾', label: 'Nông dân' },
            { path: '/admin/plots', icon: '🗺️', label: 'Vùng trồng' },
            { path: '/admin/logs', icon: '📝', label: 'Nhật ký' },
            { path: '/admin/batches', icon: '📦', label: 'Lô hàng' },
            { path: '/qr', icon: '🔲', label: 'Mã QR' },
        ],
    };

    const navItems = navConfigs[navType] || navConfigs.public;

    return (
        <>
            {/* Top Header with Logo */}
            <header className="shared-top-header">
                <div className="shared-logo-bar">
                    <div className="logo-section">
                        <Link to="/" className="logo-link">
                            <span className="logo-icon">🍈</span>
                            <span className="logo-text">Durian<span>QR</span></span>
                        </Link>
                    </div>
                    <div className="header-actions">
                        <span className="header-date">{currentDate}</span>
                        <div className="header-search">
                            <span>🔍</span>
                            <input type="text" placeholder="Tìm kiếm..." />
                        </div>
                        {user ? (
                            <div className="header-user">
                                <span className="user-avatar">👤</span>
                                <span className="user-name">{user.fullName || user.Username}</span>
                            </div>
                        ) : (
                            <Link to="/login" className="header-login-btn">
                                🔐 Đăng nhập
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Top Navigation Bar */}
            <nav className="shared-top-nav">
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
            <section className="shared-banner">
                <div className="banner-content">
                    <h1 className="banner-title">
                        {bannerIcon && <span className="banner-icon">{bannerIcon}</span>}
                        {title}
                    </h1>
                    <p className="banner-subtitle">{subtitle}</p>
                </div>
            </section>
        </>
    );
};

/**
 * Shared Footer Component
 */
export const SharedFooter = () => (
    <footer className="shared-footer">
        <div className="footer-content">
            <span className="footer-text">© 2026 DurianQR - Hệ thống truy xuất nguồn gốc sầu riêng</span>
            <div className="footer-links">
                <Link to="/guide" className="footer-link">Hướng dẫn</Link>
                <Link to="/trace" className="footer-link">Tra cứu</Link>
                <a href="mailto:support@durianqr.vn" className="footer-link">Hỗ trợ</a>
            </div>
        </div>
    </footer>
);

export default SharedHeader;
