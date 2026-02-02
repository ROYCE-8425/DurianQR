import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/farmer.css';

const FarmerDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [showAlert, setShowAlert] = useState(true);
    const [activities, setActivities] = useState([
        { id: 1, date: '02/02/2026', type: 'pesticide', name: 'Phun thuốc Regent', amount: '2 lít', plot: 'Thửa A' },
        { id: 2, date: '01/02/2026', type: 'fertilizer', name: 'Bón phân NPK 20-20-15', amount: '50 kg', plot: 'Thửa A' },
        { id: 3, date: '30/01/2026', type: 'water', name: 'Tưới nước', amount: '500 lít', plot: 'Thửa B' },
        { id: 4, date: '28/01/2026', type: 'pruning', name: 'Tỉa cành', amount: '20 cây', plot: 'Thửa A' },
        { id: 5, date: '25/01/2026', type: 'flowering', name: 'Ra hoa đợt 1', amount: '15 cây', plot: 'Thửa B' },
    ]);

    const getActivityIcon = (type) => {
        const icons = {
            pesticide: '🐛',
            fertilizer: '🧪',
            water: '💧',
            pruning: '✂️',
            flowering: '🌸',
            harvest: '🍈'
        };
        return icons[type] || '📝';
    };

    const getActivityColor = (type) => {
        const colors = {
            pesticide: '#FF9800',
            fertilizer: '#4CAF50',
            water: '#2196F3',
            pruning: '#9C27B0',
            flowering: '#E91E63',
            harvest: '#8BC34A'
        };
        return colors[type] || '#607D8B';
    };

    return (
        <div className="farmer-container">
            {/* Header */}
            <header className="farmer-header">
                <div className="header-left">
                    <h1 className="greeting">Xin chào, {user?.fullName || 'Nông dân'}! 👋</h1>
                    <p className="subtitle">Nhật ký nông vụ hôm nay</p>
                </div>
                <div className="weather-widget">
                    <span className="weather-icon">☀️</span>
                    <div className="weather-info">
                        <span className="temp">32°C</span>
                        <span className="condition">Nắng</span>
                    </div>
                </div>
            </header>

            {/* Alert Section */}
            {showAlert && (
                <div className="alert-danger">
                    <div className="alert-content">
                        <span className="alert-icon">⚠️</span>
                        <div className="alert-text">
                            <strong>CẢNH BÁO:</strong> Thửa A đang trong thời gian cách ly 14 ngày sau phun thuốc.
                            <br />Không được thu hoạch đến ngày 16/02/2026!
                        </div>
                    </div>
                    <button className="alert-close" onClick={() => setShowAlert(false)}>✕</button>
                </div>
            )}

            {/* Quick Stats */}
            <div className="quick-stats">
                <div className="stat-box">
                    <span className="stat-icon">🏡</span>
                    <span className="stat-number">3</span>
                    <span className="stat-text">Thửa đất</span>
                </div>
                <div className="stat-box">
                    <span className="stat-icon">🌳</span>
                    <span className="stat-number">150</span>
                    <span className="stat-text">Cây trồng</span>
                </div>
                <div className="stat-box stat-warning">
                    <span className="stat-icon">⏳</span>
                    <span className="stat-number">1</span>
                    <span className="stat-text">Đang cách ly</span>
                </div>
            </div>

            {/* Activity Cards */}
            <section className="activity-section">
                <h2 className="section-title">
                    <span>📋</span> Hoạt động gần đây
                </h2>

                <div className="activity-list">
                    {activities.map((activity) => (
                        <div
                            key={activity.id}
                            className="activity-card"
                            style={{ borderLeftColor: getActivityColor(activity.type) }}
                        >
                            <div className="activity-icon" style={{ background: getActivityColor(activity.type) }}>
                                {getActivityIcon(activity.type)}
                            </div>
                            <div className="activity-info">
                                <h3 className="activity-name">{activity.name}</h3>
                                <p className="activity-details">
                                    <span className="detail-item">📍 {activity.plot}</span>
                                    <span className="detail-item">📊 {activity.amount}</span>
                                </p>
                            </div>
                            <div className="activity-date">
                                <span className="date-day">{activity.date.split('/')[0]}</span>
                                <span className="date-month">Th{activity.date.split('/')[1]}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Quick Actions */}
            <div className="quick-actions-grid">
                <Link to="/harvest-request" className="action-btn action-harvest">
                    <span className="action-icon">🌳</span>
                    <span>Xin thu hoạch</span>
                </Link>
                <Link to="/trace" className="action-btn action-trace">
                    <span className="action-icon">🔍</span>
                    <span>Truy xuất</span>
                </Link>
            </div>

            {/* Floating Action Button */}
            <Link to="/farming-log" className="fab">
                <span>+</span>
            </Link>

            {/* Bottom Navigation */}
            <nav className="bottom-nav">
                <Link to="/" className="nav-item active">
                    <span className="nav-icon">🏠</span>
                    <span>Trang chủ</span>
                </Link>
                <Link to="/farming-log" className="nav-item">
                    <span className="nav-icon">📝</span>
                    <span>Nhật ký</span>
                </Link>
                <Link to="/harvest-request" className="nav-item">
                    <span className="nav-icon">🌳</span>
                    <span>Thu hoạch</span>
                </Link>
                <Link to="/guide" className="nav-item">
                    <span className="nav-icon">👤</span>
                    <span>Tài khoản</span>
                </Link>
            </nav>
        </div>
    );
};

export default FarmerDashboard;
