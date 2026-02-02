import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;
    const isFarmer = user?.Role === 'Farmer';
    const isTrader = user?.Role === 'Trader';
    const isAdmin = user?.Role === 'Admin';

    return (
        <nav style={styles.nav}>
            <div style={styles.container}>
                {/* Logo */}
                <Link to="/" style={styles.logo}>
                    <img src="/logo_durianqr.jpg" alt="DurianQR" style={styles.logoImg} />
                    <span style={styles.logoText}>DurianQR</span>
                </Link>

                {/* Navigation - Theo vai trò */}
                <div style={styles.links}>
                    {user ? (
                        <>
                            {/* Chung */}
                            <Link to="/" style={{ ...styles.link, ...(isActive('/') ? styles.active : {}) }}>
                                🏠 Trang chủ
                            </Link>

                            {/* Nông dân: Ghi nhật ký + Yêu cầu thu hoạch */}
                            {isFarmer && (
                                <>
                                    <Link to="/farming-log" style={{ ...styles.link, ...(isActive('/farming-log') ? styles.active : {}) }}>
                                        📝 Nhật ký
                                    </Link>
                                    <Link to="/harvest-request" style={{ ...styles.link, ...(isActive('/harvest-request') ? styles.active : {}) }}>
                                        🌳 Xin thu hoạch
                                    </Link>
                                </>
                            )}

                            {/* Thương lái: Quản lý kho + Tạo QR */}
                            {isTrader && (
                                <>
                                    <Link to="/warehouse" style={{ ...styles.link, ...(isActive('/warehouse') ? styles.active : {}) }}>
                                        📦 Quản lý kho
                                    </Link>
                                    <Link to="/qr" style={{ ...styles.link, ...(isActive('/qr') ? styles.active : {}) }}>
                                        🔲 Tạo mã QR
                                    </Link>
                                </>
                            )}

                            {/* Admin: Tất cả chức năng */}
                            {isAdmin && (
                                <>
                                    <Link to="/warehouse" style={{ ...styles.link, ...(isActive('/warehouse') ? styles.active : {}) }}>
                                        📦 Quản lý
                                    </Link>
                                    <Link to="/qr" style={{ ...styles.link, ...(isActive('/qr') ? styles.active : {}) }}>
                                        🔲 QR
                                    </Link>
                                </>
                            )}

                            {/* Công khai */}
                            <Link to="/trace" style={{ ...styles.link, ...(isActive('/trace') ? styles.active : {}) }}>
                                🔍 Truy xuất
                            </Link>

                            {/* User Menu */}
                            <div style={styles.user}>
                                <span style={styles.userName}>👤 {user.fullName || user.Username}</span>
                                <button onClick={handleLogout} style={styles.logout}>Đăng xuất</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/trace" style={{ ...styles.link, ...(isActive('/trace') ? styles.active : {}) }}>
                                🔍 Truy xuất
                            </Link>
                            <Link to="/guide" style={{ ...styles.link, ...(isActive('/guide') ? styles.active : {}) }}>
                                📖 Hướng dẫn
                            </Link>
                            <Link to="/login" style={styles.loginBtn}>Đăng nhập</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

const styles = {
    nav: {
        background: 'linear-gradient(135deg, #1B5E20, #2E7D32)',
        padding: '0.8rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)'
    },
    container: {
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        textDecoration: 'none'
    },
    logoImg: { width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover' },
    logoText: { fontSize: '1.6rem', fontWeight: 800, color: '#FFF59D' },
    links: {
        display: 'flex',
        gap: '0.3rem',
        alignItems: 'center'
    },
    link: {
        color: 'rgba(255,255,255,0.9)',
        textDecoration: 'none',
        fontSize: '1.15rem',
        fontWeight: 600,
        padding: '0.7rem 1rem',
        borderRadius: '10px',
        transition: 'all 0.2s'
    },
    active: {
        background: 'rgba(255,245,157,0.2)',
        color: '#FFF59D'
    },
    user: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        marginLeft: '1rem',
        paddingLeft: '1rem',
        borderLeft: '1px solid rgba(255,255,255,0.2)'
    },
    userName: { fontSize: '1rem', color: 'white' },
    logout: {
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        padding: '0.5rem 0.8rem',
        color: 'white',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem'
    },
    loginBtn: {
        background: 'rgba(255,245,157,0.2)',
        border: '1px solid rgba(255,245,157,0.4)',
        padding: '0.7rem 1.2rem',
        color: '#FFF59D',
        borderRadius: '10px',
        textDecoration: 'none',
        fontSize: '1.1rem',
        fontWeight: 700
    }
};

export default Navbar;
