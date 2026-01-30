import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>DurianQR 🌿</Link>
        <div style={styles.links}>
          {user ? (
            <>
              <Link to="/" style={styles.link}>Dashboard</Link>
              <Link to="/farms" style={styles.link}>Nông Trại</Link>
              <button onClick={handleLogout} style={styles.button}>Đăng xuất ({user.Username})</button>
            </>
          ) : (
            <Link to="/login" style={styles.link}>Đăng nhập</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    background: '#2E7D32', // Green 800
    padding: '1rem',
    color: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'white',
    textDecoration: 'none'
  },
  links: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1rem'
  },
  button: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    padding: '0.5rem 1rem',
    color: 'white',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default Navbar;
