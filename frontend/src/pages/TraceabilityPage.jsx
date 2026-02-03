import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/traceability.css';

const API_BASE = 'http://localhost:5000/api';

const TraceabilityPage = () => {
    const { batchCode } = useParams();
    const [searchCode, setSearchCode] = useState(batchCode || '');
    const [isSearching, setIsSearching] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (batchCode) {
            fetchTraceData(batchCode);
        }
    }, [batchCode]);

    const fetchTraceData = async (code) => {
        setIsSearching(true);
        setError('');
        
        try {
            const res = await fetch(`${API_BASE}/trace/${code}`);
            if (res.ok) {
                const result = await res.json();
                setData(result);
            } else if (res.status === 404) {
                setError('Không tìm thấy lô hàng với mã này');
            } else {
                setError('Đã xảy ra lỗi khi truy xuất');
            }
        } catch (err) {
            setError('Không thể kết nối đến máy chủ');
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchCode.trim()) {
            fetchTraceData(searchCode.trim());
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getActivityIcon = (type) => {
        const icons = {
            'Spraying': '🐛',
            'Fertilizing': '🧪',
            'Watering': '💧',
            'Pruning': '✂️',
            'Flowering': '🌸',
            'Harvesting': '🍈',
            'Other': '📝'
        };
        return icons[type] || '📋';
    };

    const getActivityColorClass = (type) => {
        const classes = {
            'Spraying': 'activity-spraying',
            'Fertilizing': 'activity-fertilizing',
            'Watering': 'activity-watering',
            'Pruning': 'activity-pruning',
            'Flowering': 'activity-flowering',
            'Harvesting': 'activity-harvesting',
            'Other': 'activity-other'
        };
        return classes[type] || 'activity-default';
    };

    // Demo data fallback
    const demoData = {
        batch: {
            batchCode: 'BATCH-2026-001',
            isSafe: true,
            safetyLabel: '✅ AN TOÀN - Đủ thời gian cách ly',
            status: 'Đã đóng gói'
        },
        tree: { treeCode: 'AP-001', variety: 'Sầu riêng Ri6', plantingYear: 2019 },
        farm: { farmName: 'Vườn An Phú', location: 'Đắk Lắk', area: 5.5 },
        farmer: { fullName: 'Nguyễn Văn A' },
        farmingHistory: [
            { date: '2025-10-15', activity: 'Flowering', description: 'Cây bắt đầu ra hoa đợt 1' },
            { date: '2025-11-01', activity: 'Fertilizing', description: 'Bón phân hữu cơ', chemical: 'NPK 20-20-15', dosage: '20kg' },
            { date: '2025-11-10', activity: 'Watering', description: 'Tưới nhỏ giọt định kỳ' },
            { date: '2026-01-05', activity: 'Spraying', description: 'Phun thuốc sinh học', chemical: 'Abamectin', dosage: '50ml' },
            { date: '2026-01-25', activity: 'Harvesting', description: 'Thu hoạch thủ công' }
        ],
        qrStats: { scanCount: 23, generatedAt: '2026-01-26' }
    };

    const displayData = data || (batchCode ? null : demoData);

    return (
        <div className="trace-container">
            {/* Hero Section */}
            <section className="trace-hero">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    {displayData?.batch?.isSafe !== undefined && (
                        <div className={`hero-badge ${displayData.batch.isSafe ? 'safe' : 'unsafe'}`}>
                            <span className="badge-icon">{displayData.batch.isSafe ? '✅' : '⚠️'}</span>
                            <span>{displayData.batch.isSafe ? 'Sản phẩm An toàn' : 'Cần kiểm tra'}</span>
                        </div>
                    )}
                    <h1 className="hero-title">Hành trình của Sầu riêng</h1>
                    <p className="hero-subtitle">Minh bạch từ nông trại đến bàn ăn</p>

                    {/* Search Box */}
                    <form className="search-form" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Nhập mã lô hàng (VD: BATCH-2026-001)"
                            value={searchCode}
                            onChange={(e) => setSearchCode(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="search-btn" disabled={isSearching}>
                            {isSearching ? '⏳' : '🔍'} Truy xuất
                        </button>
                    </form>

                    {error && (
                        <div className="error-message">
                            ❌ {error}
                        </div>
                    )}
                </div>
            </section>

            {displayData && (
                <>
                    {/* Product Info */}
                    <section className="product-section">
                        <div className="product-header">
                            <span className="product-icon">🍈</span>
                            <div className="product-title-group">
                                <h2 className="product-name">{displayData.tree?.variety || 'Sầu riêng Việt Nam'}</h2>
                                <span className="batch-code">Mã lô: {displayData.batch?.batchCode}</span>
                            </div>
                        </div>

                        <div className="product-details">
                            <div className="detail-card">
                                <span className="detail-icon">📅</span>
                                <span className="detail-label">Thu hoạch</span>
                                <span className="detail-value">
                                    {formatDate(displayData.farmingHistory?.find(h => h.activity === 'Harvesting')?.date)}
                                </span>
                            </div>
                            <div className="detail-card">
                                <span className="detail-icon">📍</span>
                                <span className="detail-label">Vùng trồng</span>
                                <span className="detail-value">{displayData.farm?.location || 'N/A'}</span>
                            </div>
                            <div className="detail-card">
                                <span className="detail-icon">👨‍🌾</span>
                                <span className="detail-label">Nông dân</span>
                                <span className="detail-value">{displayData.farmer?.fullName || 'N/A'}</span>
                            </div>
                            <div className="detail-card">
                                <span className="detail-icon">🌳</span>
                                <span className="detail-label">Mã cây</span>
                                <span className="detail-value">{displayData.tree?.treeCode || 'N/A'}</span>
                            </div>
                        </div>
                    </section>

                    {/* Farm Details */}
                    <section className="farm-section container mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Farm Card */}
                            <div className="info-card farm-card">
                                <h3 className="text-secondary mb-3">
                                    🏡 Nông trại
                                </h3>
                                <div className="info-value">
                                    {displayData.farm?.farmName || 'N/A'}
                                </div>
                                <div className="info-sub text-muted">
                                    📍 {displayData.farm?.location || 'N/A'}
                                </div>
                                {displayData.farm?.area && (
                                    <div className="info-sub text-muted">
                                        📐 {displayData.farm.area} ha
                                    </div>
                                )}
                            </div>

                            {/* Tree Card */}
                            <div className="info-card tree-card">
                                <h3 className="text-warning mb-3">
                                    🌳 Thông tin cây
                                </h3>
                                <div className="info-value">
                                    {displayData.tree?.variety || 'Sầu riêng'}
                                </div>
                                <div className="info-sub text-muted">
                                    🏷️ Mã: {displayData.tree?.treeCode}
                                </div>
                                {displayData.tree?.plantingYear && (
                                    <div className="info-sub text-muted">
                                        📅 Năm trồng: {displayData.tree.plantingYear}
                                    </div>
                                )}
                            </div>

                            {/* QR Stats */}
                            {displayData.qrStats && (
                                <div className="info-card qr-card">
                                    <h3 className="text-purple mb-3">
                                        📊 Thống kê QR
                                    </h3>
                                    <div className="flex items-center gap-4">
                                        <div className="qr-stat-box">
                                            <div className="qr-count">
                                                {displayData.qrStats.scanCount}
                                            </div>
                                            <div className="qr-label">
                                                Lượt quét
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Timeline */}
                    <section className="timeline-section">
                        <h2 className="section-title">
                            <span>📋</span> Lịch sử canh tác
                        </h2>

                        <div className="timeline">
                            {(displayData.farmingHistory || []).map((item, index) => (
                                <div 
                                    key={index} 
                                    className="timeline-item slide-in"
                                    style={{ animationDelay: `${index * 0.15}s` }}
                                >
                                    <div 
                                        className={`timeline-marker ${getActivityColorClass(item.activity)}`}
                                    >
                                        <span>{getActivityIcon(item.activity)}</span>
                                    </div>
                                    <div className="timeline-content">
                                        <div className="timeline-header">
                                            <h3 className="timeline-title">{item.activity}</h3>
                                            <span className="timeline-date">{formatDate(item.date)}</span>
                                        </div>
                                        <p className="timeline-desc">{item.description}</p>
                                        {item.chemical && (
                                            <div className="timeline-chemical">
                                                💊 {item.chemical} {item.dosage && `- ${item.dosage}`}
                                            </div>
                                        )}
                                    </div>
                                    {index < (displayData.farmingHistory?.length || 0) - 1 && (
                                        <div className="timeline-line"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Safety Badge */}
                    {displayData.batch?.isSafe !== undefined && (
                        <section className="safety-section text-center py-8">
                            <div className={`safety-badge-large ${displayData.batch.isSafe ? 'safe' : 'unsafe'}`}>
                                <div className="text-5xl mb-3">
                                    {displayData.batch.isSafe ? '✅' : '⚠️'}
                                </div>
                                <div className={`text-xl font-bold ${displayData.batch.isSafe ? 'text-success' : 'text-danger'}`}>
                                    {displayData.batch.safetyLabel || (displayData.batch.isSafe ? 'SẢN PHẨM AN TOÀN' : 'CẦN KIỂM TRA')}
                                </div>
                                <div className="text-muted mt-2">
                                    Đã qua kiểm tra thời gian cách ly thuốc BVTV
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Certification */}
                    <section className="cert-section">
                        <h2 className="section-title">
                            <span>🏅</span> Chứng nhận chất lượng
                        </h2>
                        <div className="cert-grid">
                            <div className="cert-card">
                                <div className="cert-badge vietgap">VietGAP</div>
                                <span className="cert-text">Chứng nhận thực hành nông nghiệp tốt Việt Nam</span>
                            </div>
                            <div className="cert-card">
                                <div className="cert-badge organic">ORGANIC</div>
                                <span className="cert-text">Sản phẩm hữu cơ, không hóa chất độc hại</span>
                            </div>
                            <div className="cert-card">
                                <div className="cert-badge safe">AN TOÀN</div>
                                <span className="cert-text">Đạt tiêu chuẩn an toàn thực phẩm</span>
                            </div>
                        </div>
                    </section>
                </>
            )}

            {/* Footer */}
            <footer className="trace-footer">
                <div className="footer-content">
                    <div className="footer-logo">
                        <span>🍈</span>
                        <span>DurianQR</span>
                    </div>
                    <p className="footer-text">
                        Hệ thống truy xuất nguồn gốc sầu riêng
                        <br />
                        © 2026 DurianQR - HUTECH
                    </p>
                    <Link to="/" className="home-btn btn-glass">
                        🏠 Về trang chủ
                    </Link>
                </div>
            </footer>
        </div>
    );
};

export default TraceabilityPage;
