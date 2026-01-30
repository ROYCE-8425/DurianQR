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

  // Check if user is warehouse manager or admin
  const isWarehouseRole = user?.Role === 'WarehouseManager' || user?.Role === 'Admin';

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>🍈</span>
          <span style={styles.logoText}>DurianQR</span>
        </Link>

        {/* Navigation Links */}
        <div style={styles.links}>
          {user ? (
            <>
              <Link 
                to="/" 
                style={{
                  ...styles.link,
                  ...(isActive('/') ? styles.linkActive : {})
                }}
              >
                🏠 Dashboard
              </Link>
              
              {/* Farmer link */}
              <Link 
                to="/harvest-request" 
                style={{
                  ...styles.link,
                  ...(isActive('/harvest-request') ? styles.linkActive : {})
                }}
              >
                🌳 Xin thu hoạch
              </Link>
              
              {/* Warehouse Manager / Admin links */}
              {isWarehouseRole && (
                <Link 
                  to="/warehouse" 
                  style={{
                    ...styles.link,
                    ...(isActive('/warehouse') ? styles.linkActive : {})
                  }}
                >
                  📦 Quản lý kho
                </Link>
              )}
              
              <Link 
                to="/qr" 
                style={{
                  ...styles.link,
                  ...(isActive('/qr') ? styles.linkActive : {})
                }}
              >
                🔲 QR Code
              </Link>
              <Link 
                to="/trace" 
                style={{
                  ...styles.link,
                  ...(isActive('/trace') ? styles.linkActive : {})
                }}
              >
                🔍 Truy xuất
              </Link>
              
              {/* User Menu */}
              <div style={styles.userMenu}>
                <span style={styles.userName}>
                  👤 {user.fullName || user.Username}
                  {user.Role && <span style={styles.roleBadge}>{user.Role}</span>}
                </span>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                  Đăng xuất
                </button>
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/trace" 
                style={{
                  ...styles.link,
                  ...(isActive('/trace') ? styles.linkActive : {})
                }}
              >
                🔍 Truy xuất
              </Link>
              <Link to="/login" style={styles.loginBtn}>
                Đăng nhập
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    background: 'linear-gradient(135deg, rgba(27, 94, 32, 0.95), rgba(46, 125, 50, 0.95))',
    backdropFilter: 'blur(20px)',
    padding: '0.75rem 1.5rem',
    color: 'white',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
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
    textDecoration: 'none',
    transition: 'transform 0.3s ease'
  },
  logoIcon: {
    fontSize: '1.8rem'
  },
  logoText: {
    fontSize: '1.4rem',
    fontWeight: 700,
    color: 'white',
    background: 'linear-gradient(135deg, #fff, #A5D6A7)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  links: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center'
  },
  link: {
    color: 'rgba(255, 255, 255, 0.85)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    padding: '0.6rem 1rem',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
    border: '1px solid transparent'
  },
  linkActive: {
    background: 'rgba(255, 255, 255, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white'
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginLeft: '1rem',
    paddingLeft: '1rem',
    borderLeft: '1px solid rgba(255, 255, 255, 0.2)'
  },
  userName: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.9)'
  },
  logoutBtn: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '0.5rem 1rem',
    color: 'white',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    transition: 'all 0.3s ease'
  },
  loginBtn: {
    background: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    padding: '0.6rem 1.25rem',
    color: 'white',
    borderRadius: '10px',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 600,
    transition: 'all 0.3s ease'
  },
  roleBadge: {
    marginLeft: '0.5rem',
    padding: '0.2rem 0.5rem',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '6px',
    fontSize: '0.7rem',
    fontWeight: 600
  }
};

export default Navbar;
