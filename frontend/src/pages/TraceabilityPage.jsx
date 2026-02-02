import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/traceability.css';

const TraceabilityPage = () => {
    const { batchCode } = useParams();
    const [searchCode, setSearchCode] = useState(batchCode || '');
    const [isSearching, setIsSearching] = useState(false);

    // Demo data
    const productData = {
        batchCode: 'BATCH-2026-001',
        harvestDate: '25/01/2026',
        variety: 'Sầu riêng Ri6',
        weight: '3.5 kg',
        farmer: 'Nguyễn Văn A',
        region: 'Đắk Lắk',
        certification: 'VietGAP',
        plot: 'Thửa A-01',
        treeCount: 50,
    };

    const timeline = [
        {
            stage: 1,
            title: 'Ra hoa',
            date: '15/10/2025',
            description: 'Cây bắt đầu ra hoa đợt 1, tình trạng tốt',
            icon: '🌸',
            color: '#E91E63',
        },
        {
            stage: 2,
            title: 'Chăm sóc - Bón phân',
            date: '01/11/2025',
            description: 'Bón phân hữu cơ Organic Pro, 20kg/cây',
            icon: '🧪',
            color: '#4CAF50',
        },
        {
            stage: 3,
            title: 'Chăm sóc - Tưới nước',
            date: '10/11/2025',
            description: 'Tưới nhỏ giọt định kỳ, 50 lít/cây',
            icon: '💧',
            color: '#2196F3',
        },
        {
            stage: 4,
            title: 'Phun thuốc BVTV',
            date: '05/01/2026',
            description: 'Thuốc trừ sâu sinh học BioProtect',
            icon: '🐛',
            color: '#FF9800',
            warning: 'Đã đủ thời gian cách ly 20 ngày',
        },
        {
            stage: 5,
            title: 'Thu hoạch',
            date: '25/01/2026',
            description: 'Thu hoạch thủ công, kiểm tra độ chín đạt chuẩn',
            icon: '🍈',
            color: '#8BC34A',
        },
        {
            stage: 6,
            title: 'Đóng gói & Vận chuyển',
            date: '26/01/2026',
            description: 'Đóng gói tại kho HTX, xe lạnh vận chuyển',
            icon: '📦',
            color: '#9C27B0',
        },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        setIsSearching(true);
        setTimeout(() => setIsSearching(false), 1000);
    };

    return (
        <div className="trace-container">
            {/* Hero Section */}
            <section className="trace-hero">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="badge-icon">✅</span>
                        <span>{productData.certification} Certified</span>
                    </div>
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
                            {isSearching ? '🔄' : '🔍'} Truy xuất
                        </button>
                    </form>
                </div>
            </section>

            {/* Product Info */}
            <section className="product-section">
                <div className="product-header">
                    <span className="product-icon">🍈</span>
                    <div className="product-title-group">
                        <h2 className="product-name">{productData.variety}</h2>
                        <span className="batch-code">Mã lô: {productData.batchCode}</span>
                    </div>
                </div>

                <div className="product-details">
                    <div className="detail-card">
                        <span className="detail-icon">📅</span>
                        <span className="detail-label">Thu hoạch</span>
                        <span className="detail-value">{productData.harvestDate}</span>
                    </div>
                    <div className="detail-card">
                        <span className="detail-icon">⚖️</span>
                        <span className="detail-label">Khối lượng</span>
                        <span className="detail-value">{productData.weight}</span>
                    </div>
                    <div className="detail-card">
                        <span className="detail-icon">📍</span>
                        <span className="detail-label">Vùng trồng</span>
                        <span className="detail-value">{productData.region}</span>
                    </div>
                    <div className="detail-card">
                        <span className="detail-icon">👨‍🌾</span>
                        <span className="detail-label">Nông dân</span>
                        <span className="detail-value">{productData.farmer}</span>
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="timeline-section">
                <h2 className="section-title">
                    <span>📋</span> Lịch sử canh tác
                </h2>

                <div className="timeline">
                    {timeline.map((item, index) => (
                        <div key={item.stage} className="timeline-item">
                            <div className="timeline-marker" style={{ background: item.color }}>
                                <span>{item.icon}</span>
                            </div>
                            <div className="timeline-content">
                                <div className="timeline-header">
                                    <h3 className="timeline-title">{item.title}</h3>
                                    <span className="timeline-date">{item.date}</span>
                                </div>
                                <p className="timeline-desc">{item.description}</p>
                                {item.warning && (
                                    <div className="timeline-warning">
                                        <span>✅</span> {item.warning}
                                    </div>
                                )}
                            </div>
                            {index < timeline.length - 1 && <div className="timeline-line"></div>}
                        </div>
                    ))}
                </div>
            </section>

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
                    <button className="report-btn">
                        <span>🚨</span> Báo cáo vấn đề
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default TraceabilityPage;
