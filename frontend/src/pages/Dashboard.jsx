import { useEffect, useState } from 'react';
import api from '../services/api';

const Dashboard = () => {
  const [farms, setFarms] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await api.get('/farms');
        setFarms(response.data);
      } catch (error) {
        console.error('Error fetching farms:', error);
      }
    };
    if (user) fetchFarms();
  }, [user]);

  if (!user) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Vui lòng đăng nhập để tiếp tục</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Quản lý Nông Trại - {user.Username}</h1>
      
      <div style={styles.grid}>
        {farms.map(farm => (
          <div key={farm.farmID} style={styles.card}>
            <h3>{farm.farmName}</h3>
            <p><strong>Vị trí:</strong> {farm.location}</p>
            <p><strong>Diện tích:</strong> {farm.area} ha</p>
            <p><strong>Số cây:</strong> {farm.trees ? farm.trees.length : 0}</p>
          </div>
        ))}
        {farms.length === 0 && <p>Chưa có nông trại nào.</p>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  },
  title: {
    color: '#333',
    marginBottom: '2rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem'
  },
  card: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    border: '1px solid #eee'
  }
};

export default Dashboard;
