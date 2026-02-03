import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import SharedHeader, { SharedFooter } from '../components/SharedHeader';
import '../styles/shared-header.css';

const Dashboard = () => {
  const location = useLocation();
  const [stats, setStats] = useState({
    farms: 0,
    trees: 0,
    batches: 0,
    qrcodes: 0
  });
  const [farms, setFarms] = useState([]);
  const [recentBatches, setRecentBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [farmsRes, batchesRes, qrRes] = await Promise.all([
          api.get('/farms'),
          api.get('/batches'),
          api.get('/qr')
        ]);

        setFarms(farmsRes.data);
        setRecentBatches(batchesRes.data.slice(0, 5));

        const totalTrees = farmsRes.data.reduce((sum, farm) =>
          sum + (farm.trees?.length || 0), 0);

        setStats({
          farms: farmsRes.data.length,
          trees: totalTrees,
          batches: batchesRes.data.length,
          qrcodes: qrRes.data.length
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
    else setLoading(false);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Not logged in - Landing Page
  if (!user) {
    return (
      <div className="shared-page-layout">
        <SharedHeader
          title="Chào mừng đến DurianQR"
          subtitle="Hệ thống truy xuất nguồn gốc sầu riêng thông minh - Minh bạch từ nông trại đến bàn ăn"
          bannerIcon="🍈"
          navType="public"
        />

        <div className="shared-page-body">
          <main className="shared-page-main">
            {/* Quick Actions */}
            <div style={styles.quickActions}>
              <Link to="/login" style={styles.actionCard}>
                <span style={styles.actionIcon}>🔐</span>
                <span style={styles.actionLabel}>Đăng nhập</span>
              </Link>
              <Link to="/register" style={styles.actionCard}>
                <span style={styles.actionIcon}>📝</span>
                <span style={styles.actionLabel}>Đăng ký</span>
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

            {/* Features Section */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>✨ Tính năng nổi bật</h2>
              <div style={styles.featuresGrid}>
                <div style={styles.featureCard}>
                  <span style={styles.featureIcon}>📱</span>
                  <h3 style={styles.featureTitle}>QR</h3>
                  <p style={styles.featureDesc}>Quét mã nhanh chóng</p>
                </div>
                <div style={styles.featureCard}>
                  <span style={styles.featureIcon}>🌳</span>
                  <h3 style={styles.featureTitle}>100%</h3>
                  <p style={styles.featureDesc}>Theo dõi nguồn gốc</p>
                </div>
                <div style={styles.featureCard}>
                  <span style={styles.featureIcon}>📊</span>
                  <h3 style={styles.featureTitle}>24/7</h3>
                  <p style={styles.featureDesc}>Giám sát liên tục</p>
                </div>
                <div style={styles.featureCard}>
                  <span style={styles.featureIcon}>✅</span>
                  <h3 style={styles.featureTitle}>VietGAP</h3>
                  <p style={styles.featureDesc}>Tiêu chuẩn chất lượng</p>
                </div>
              </div>
            </section>

            {/* Why DurianQR Section */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>🎯 Tại sao chọn DurianQR?</h2>
              <div style={styles.whyGrid}>
                <div style={styles.whyCard}>
                  <h3 style={styles.whyTitle}>🔒 An toàn thực phẩm</h3>
                  <p style={styles.whyDesc}>
                    Kiểm soát thời gian cách ly sau phun thuốc BVTV, đảm bảo sản phẩm an toàn cho người tiêu dùng và đạt chuẩn xuất khẩu.
                  </p>
                </div>
                <div style={styles.whyCard}>
                  <h3 style={styles.whyTitle}>📈 Tăng giá trị sản phẩm</h3>
                  <p style={styles.whyDesc}>
                    Sản phẩm có truy xuất nguồn gốc rõ ràng được khách hàng tin tưởng, sẵn sàng trả giá cao hơn 15-30%.
                  </p>
                </div>
                <div style={styles.whyCard}>
                  <h3 style={styles.whyTitle}>🛡️ Bảo vệ thương hiệu</h3>
                  <p style={styles.whyDesc}>
                    Nếu có sự cố về chất lượng, dễ dàng xác định nguồn gốc để xử lý, tránh ảnh hưởng toàn bộ mã số vùng trồng.
                  </p>
                </div>
              </div>
            </section>
          </main>
        </div>

        <SharedFooter />
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="shared-page-layout">
        <SharedHeader
          title="Đang tải..."
          subtitle="Vui lòng đợi"
          bannerIcon="⏳"
          navType="public"
        />
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>Đang tải dữ liệu...</p>
        </div>
        <SharedFooter />
      </div>
    );
  }

  // Logged in - Dashboard
  return (
    <div className="shared-page-layout">
      <SharedHeader
        title={`Xin chào, ${user.fullName || user.Username}!`}
        subtitle="Tổng quan hệ thống quản lý nông trại sầu riêng"
        bannerIcon="🍈"
        navType="public"
      />

      <div className="shared-page-body">
        <main className="shared-page-main">
          {/* Quick Actions */}
          <div style={styles.quickActions}>
            <Link to="/qr" style={styles.actionCard}>
              <span style={styles.actionIcon}>🔲</span>
              <span style={styles.actionLabel}>Tạo QR Code</span>
            </Link>
            <Link to="/trace" style={styles.actionCard}>
              <span style={styles.actionIcon}>🔍</span>
              <span style={styles.actionLabel}>Truy xuất nguồn gốc</span>
            </Link>
            <Link to="/harvest-request" style={styles.actionCard}>
              <span style={styles.actionIcon}>📋</span>
              <span style={styles.actionLabel}>Yêu cầu thu hoạch</span>
            </Link>
            <Link to="/warehouse" style={styles.actionCard}>
              <span style={styles.actionIcon}>🏭</span>
              <span style={styles.actionLabel}>Quản lý kho</span>
            </Link>
            <Link to="/guide" style={styles.actionCard}>
              <span style={styles.actionIcon}>📖</span>
              <span style={styles.actionLabel}>Hướng dẫn sử dụng</span>
            </Link>
          </div>

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
              <span style={styles.statIcon}>📦</span>
              <span style={styles.statValue}>{stats.batches}</span>
              <span style={styles.statLabel}>Lô thu hoạch</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statIcon}>🔲</span>
              <span style={styles.statValue}>{stats.qrcodes}</span>
              <span style={styles.statLabel}>QR Code</span>
            </div>
          </div>

          {/* Farms Section */}
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>🏡 Nông trại của bạn</h2>
              <button style={styles.btnPrimary}>+ Thêm nông trại mới</button>
            </div>

            {farms.length === 0 ? (
              <div style={styles.emptyState}>
                <span style={styles.emptyIcon}>🌱</span>
                <h3>Chưa có nông trại nào</h3>
                <p>Bắt đầu bằng cách thêm nông trại đầu tiên của bạn</p>
              </div>
            ) : (
              <div style={styles.cardsGrid}>
                {farms.map((farm) => (
                  <div key={farm.farmID} style={styles.card}>
                    <div style={styles.cardHeader}>
                      <h3 style={styles.cardTitle}>🏡 {farm.farmName}</h3>
                      <span style={styles.badgeSuccess}>Hoạt động</span>
                    </div>
                    <div style={styles.cardBody}>
                      <div style={styles.cardRow}>
                        <span>📍 Vị trí</span>
                        <span>{farm.location || 'Chưa cập nhật'}</span>
                      </div>
                      <div style={styles.cardRow}>
                        <span>📐 Diện tích</span>
                        <span>{farm.area ? `${farm.area} ha` : 'N/A'}</span>
                      </div>
                      <div style={styles.cardRow}>
                        <span>🌳 Số cây</span>
                        <span>{farm.trees?.length || 0} cây</span>
                      </div>
                    </div>
                    <div style={styles.cardFooter}>
                      <button style={styles.btnOutline}>Xem chi tiết</button>
                      <button style={styles.btnSecondary}>Chỉnh sửa</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recent Batches Section */}
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>📦 Lô hàng gần đây</h2>
              <Link to="/qr" style={styles.btnPrimary}>Quản lý QR Code</Link>
            </div>

            {recentBatches.length === 0 ? (
              <div style={styles.emptyState}>
                <span style={styles.emptyIcon}>📦</span>
                <h3>Chưa có lô hàng nào</h3>
                <p>Các lô thu hoạch sẽ xuất hiện tại đây sau khi bạn tạo</p>
              </div>
            ) : (
              <div style={styles.cardsGrid}>
                {recentBatches.map((batch) => (
                  <div key={batch.batchID} style={styles.card}>
                    <div style={styles.cardHeader}>
                      <h3 style={styles.cardTitle}>📦 {batch.batchCode}</h3>
                      <span style={batch.isSafe ? styles.badgeSuccess : styles.badgeWarning}>
                        {batch.isSafe ? '✅ An toàn' : '⏳ Đang chờ'}
                      </span>
                    </div>
                    <div style={styles.cardBody}>
                      <div style={styles.cardRow}>
                        <span>📊 Trạng thái</span>
                        <span>{batch.status}</span>
                      </div>
                      <div style={styles.cardRow}>
                        <span>📅 Thu hoạch</span>
                        <span>{formatDate(batch.actualHarvest)}</span>
                      </div>
                      <div style={styles.cardRow}>
                        <span>⚖️ Khối lượng</span>
                        <span>{batch.quantity ? `${batch.quantity} kg` : 'N/A'}</span>
                      </div>
                    </div>
                    <div style={styles.cardFooter}>
                      <Link to={`/trace/${batch.batchCode}`} style={styles.btnOutline}>
                        🔍 Xem truy xuất
                      </Link>
                      <button style={styles.btnSecondary}>🔲 Tạo QR</button>
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
  quickActions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
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
  actionLabel: { fontSize: '0.875rem', fontWeight: 600, textAlign: 'center' },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  statCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1.5rem',
    background: '#ffffff',
    border: '1px solid #e5e5e5',
    borderRadius: '8px',
    textAlign: 'center',
  },
  statIcon: { fontSize: '2rem' },
  statValue: { fontSize: '2rem', fontWeight: 700, color: '#1a1a1a' },
  statLabel: { fontSize: '0.75rem', fontWeight: 600, color: '#888', textTransform: 'uppercase' },
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
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#1a1a1a',
    margin: 0,
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1.5rem',
  },
  featureCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '2rem 1rem',
    background: '#ffffff',
    border: '1px solid #e5e5e5',
    borderRadius: '8px',
    textAlign: 'center',
  },
  featureIcon: { fontSize: '2.5rem' },
  featureTitle: { fontSize: '1.5rem', fontWeight: 700, color: '#2d5a27' },
  featureDesc: { fontSize: '0.875rem', color: '#555' },
  whyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.5rem',
  },
  whyCard: {
    padding: '1.5rem',
    background: '#ffffff',
    border: '1px solid #e5e5e5',
    borderRadius: '8px',
  },
  whyTitle: { fontSize: '1rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.75rem' },
  whyDesc: { fontSize: '0.9rem', color: '#555', lineHeight: 1.7 },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    background: '#ffffff',
    border: '1px solid #e5e5e5',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.25rem',
    borderBottom: '1px solid #f0f0f0',
  },
  cardTitle: { fontSize: '1rem', fontWeight: 600, color: '#1a1a1a', margin: 0 },
  cardBody: { padding: '1rem 1.25rem' },
  cardRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    fontSize: '0.9rem',
    color: '#555',
  },
  cardFooter: {
    display: 'flex',
    gap: '0.5rem',
    padding: '1rem 1.25rem',
    borderTop: '1px solid #f0f0f0',
  },
  btnPrimary: {
    padding: '0.5rem 1rem',
    background: '#2d5a27',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
  },
  btnOutline: {
    padding: '0.5rem 1rem',
    background: 'transparent',
    color: '#2d5a27',
    border: '1px solid #2d5a27',
    borderRadius: '4px',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
  },
  btnSecondary: {
    padding: '0.5rem 1rem',
    background: '#fafafa',
    color: '#555',
    border: '1px solid #e5e5e5',
    borderRadius: '4px',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  badgeSuccess: {
    padding: '0.25rem 0.75rem',
    background: '#e8f5e9',
    color: '#2e7d32',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  badgeWarning: {
    padding: '0.25rem 0.75rem',
    background: '#fff3e0',
    color: '#e65100',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 600,
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

export default Dashboard;
