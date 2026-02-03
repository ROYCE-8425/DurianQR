import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../../styles/navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path ? 'active' : '';
    const isFarmer = user?.Role === 'Farmer';
    const isTrader = user?.Role === 'Trader';
    const isAdmin = user?.Role === 'Admin';

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo */}
                <Link to="/" className="logo-link">
                    <img src="/logo_durianqr.jpg" alt="DurianQR" className="logo-img" />
                    <span className="logo-text">DurianQR</span>
                </Link>

                {/* Navigation */}
                <div className="nav-links">
                    {user ? (
                        <>
                            <Link to="/" className={`nav-item ${isActive('/')}`}>
                                <span className="icon">🏠</span>
                                <span>Trang chủ</span>
                            </Link>

                            {isFarmer && (
                                <>
                                    <Link to="/farming-log" className={`nav-item ${isActive('/farming-log')}`}>
                                        <span className="icon">📝</span>
                                        <span>Nhật ký</span>
                                    </Link>
                                    <Link to="/harvest-request" className={`nav-item ${isActive('/harvest-request')}`}>
                                        <span className="icon">🌳</span>
                                        <span>Xin thu hoạch</span>
                                    </Link>
                                </>
                            )}

                            {isTrader && (
                                <>
                                    <Link to="/warehouse" className={`nav-item ${isActive('/warehouse')}`}>
                                        <span className="icon">📦</span>
                                        <span>Quản lý kho</span>
                                    </Link>
                                    <Link to="/qr" className={`nav-item ${isActive('/qr')}`}>
                                        <span className="icon">🔲</span>
                                        <span>Tạo mã QR</span>
                                    </Link>
                                </>
                            )}

                            {isAdmin && (
                                <>
                                    <Link to="/admin" className={`nav-item ${isActive('/admin')}`}>
                                        <span className="icon">📊</span>
                                        <span>Dashboard</span>
                                    </Link>
                                    <Link to="/warehouse" className={`nav-item ${isActive('/warehouse')}`}>
                                        <span className="icon">📦</span>
                                        <span>Kho</span>
                                    </Link>
                                </>
                            )}

                            <Link to="/trace" className={`nav-item ${isActive('/trace')}`}>
                                <span className="icon">🔍</span>
                                <span>Truy xuất</span>
                            </Link>

                            {/* User Menu */}
                            <div className="user-menu">
                                <span className="user-name">
                                    👤 {user.fullName || user.Username}
                                </span>
                                <button onClick={handleLogout} className="logout-btn">
                                    Đăng xuất
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/trace" className={`nav-item ${isActive('/trace')}`}>
                                <span className="icon">🔍</span>
                                <span>Truy xuất</span>
                            </Link>
                            <Link to="/guide" className={`nav-item ${isActive('/guide')}`}>
                                <span className="icon">📖</span>
                                <span>Hướng dẫn</span>
                            </Link>
                            <Link to="/login" className="login-btn-nav">
                                Đăng nhập
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
