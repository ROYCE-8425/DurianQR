import { Link } from 'react-router-dom';
import '../styles/global.css';

const GuidePage = () => {
    return (
        <div className="page-container">
            {/* Header */}
            <div className="page-header">
                <span className="page-icon">📖</span>
                <h1 className="page-title">Hướng dẫn sử dụng</h1>
                <p className="page-subtitle">Hướng dẫn chi tiết cách sử dụng hệ thống DurianQR</p>
            </div>

            {/* Quick Navigation */}
            <div className="quick-actions">
                <a href="#farmer" className="quick-action-btn">
                    <span className="icon">👨‍🌾</span>
                    <span>Dành cho Nông dân</span>
                </a>
                <a href="#cooperative" className="quick-action-btn">
                    <span className="icon">🏢</span>
                    <span>Dành cho Hợp tác xã</span>
                </a>
                <a href="#consumer" className="quick-action-btn">
                    <span className="icon">🛒</span>
                    <span>Dành cho Người tiêu dùng</span>
                </a>
                <a href="#faq" className="quick-action-btn">
                    <span className="icon">❓</span>
                    <span>Câu hỏi thường gặp</span>
                </a>
            </div>

            {/* Section: Dành cho Nông dân */}
            <div className="section" id="farmer">
                <div className="section-header">
                    <h2 className="section-title">
                        <span>👨‍🌾</span> Hướng dẫn dành cho Nông dân
                    </h2>
                </div>

                <div className="info-card" style={{ marginBottom: '2rem' }}>
                    <div className="info-card-header">
                        <span className="info-card-icon">📱</span>
                        <h3 className="info-card-title">Các bước sử dụng cơ bản</h3>
                    </div>

                    <div className="guide-steps">
                        <div className="guide-step">
                            <span className="step-number">1</span>
                            <div className="step-content">
                                <h4>Đăng ký tài khoản</h4>
                                <p>Truy cập trang Đăng ký, nhập đầy đủ thông tin cá nhân và số điện thoại. Sau khi đăng ký thành công, bạn sẽ nhận được thông báo xác nhận.</p>
                            </div>
                        </div>
                        <div className="guide-step">
                            <span className="step-number">2</span>
                            <div className="step-content">
                                <h4>Thêm thông tin nông trại</h4>
                                <p>Vào mục Dashboard, chọn "Thêm nông trại mới". Nhập thông tin vùng trồng, diện tích canh tác, số lượng cây và loại giống sầu riêng.</p>
                            </div>
                        </div>
                        <div className="guide-step">
                            <span className="step-number">3</span>
                            <div className="step-content">
                                <h4>Ghi nhật ký canh tác hàng ngày</h4>
                                <p>Mỗi khi thực hiện các hoạt động như bón phân, tưới nước, phun thuốc BVTV, hãy ghi lại vào hệ thống. Chụp ảnh minh chứng để tăng độ tin cậy.</p>
                            </div>
                        </div>
                        <div className="guide-step">
                            <span className="step-number">4</span>
                            <div className="step-content">
                                <h4>Yêu cầu thu hoạch</h4>
                                <p>Khi sầu riêng đến thời điểm thu hoạch, vào mục "Xin thu hoạch" để đăng ký lô hàng. Hệ thống sẽ tự động kiểm tra thời gian cách ly an toàn.</p>
                            </div>
                        </div>
                        <div className="guide-step">
                            <span className="step-number">5</span>
                            <div className="step-content">
                                <h4>Nhận và in mã QR</h4>
                                <p>Sau khi lô hàng được phê duyệt, bạn có thể tạo và in mã QR để dán lên sản phẩm. Khách hàng quét mã sẽ thấy toàn bộ lịch sử canh tác.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Warning Box */}
                <div className="glass-card" style={{ borderColor: 'rgba(255, 193, 7, 0.5)', background: 'linear-gradient(145deg, rgba(255, 193, 7, 0.1), rgba(255, 235, 59, 0.05))' }}>
                    <div className="card-header">
                        <h3 className="card-title">
                            <span className="icon">⚠️</span>
                            Lưu ý quan trọng
                        </h3>
                    </div>
                    <div className="card-body">
                        <ul style={{ paddingLeft: '1.5rem', lineHeight: '2' }}>
                            <li>Ghi nhật ký <strong>đúng thời gian thực</strong> - Hệ thống không cho phép ghi lùi ngày</li>
                            <li>Đảm bảo <strong>thời gian cách ly</strong> sau khi phun thuốc (tối thiểu 7-14 ngày tùy loại thuốc)</li>
                            <li>Chụp ảnh <strong>vỏ thuốc/phân bón</strong> để làm minh chứng</li>
                            <li>Cập nhật đầy đủ thông tin để <strong>tăng điểm uy tín</strong> của bạn</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Section: Dành cho Hợp tác xã */}
            <div className="section" id="cooperative">
                <div className="section-header">
                    <h2 className="section-title">
                        <span>🏢</span> Hướng dẫn dành cho Hợp tác xã
                    </h2>
                </div>

                <div className="info-card" style={{ marginBottom: '2rem' }}>
                    <div className="info-card-header">
                        <span className="info-card-icon">💼</span>
                        <h3 className="info-card-title">Quản lý và giám sát</h3>
                    </div>

                    <div className="guide-steps">
                        <div className="guide-step">
                            <span className="step-number">1</span>
                            <div className="step-content">
                                <h4>Quản lý nông dân thành viên</h4>
                                <p>Thêm, sửa, xóa thông tin nông dân trong hợp tác xã. Theo dõi trạng thái tuân thủ VietGAP/GlobalGAP của từng hộ.</p>
                            </div>
                        </div>
                        <div className="guide-step">
                            <span className="step-number">2</span>
                            <div className="step-content">
                                <h4>Duyệt yêu cầu thu hoạch</h4>
                                <p>Kiểm tra các yêu cầu thu hoạch từ nông dân. Hệ thống sẽ tự động cảnh báo nếu chưa đủ thời gian cách ly an toàn.</p>
                            </div>
                        </div>
                        <div className="guide-step">
                            <span className="step-number">3</span>
                            <div className="step-content">
                                <h4>Tạo lô hàng xuất khẩu (Batching)</h4>
                                <p>Gom các lô nhỏ từ nhiều hộ nông dân thành một lô xuất khẩu. Hệ thống tự động liên kết dữ liệu truy xuất.</p>
                            </div>
                        </div>
                        <div className="guide-step">
                            <span className="step-number">4</span>
                            <div className="step-content">
                                <h4>Tạo và quản lý mã QR</h4>
                                <p>Sinh mã QR cho từng lô hàng. Mã QR chứa toàn bộ thông tin từ nông trại đến điểm xuất hàng.</p>
                            </div>
                        </div>
                        <div className="guide-step">
                            <span className="step-number">5</span>
                            <div className="step-content">
                                <h4>Xem báo cáo và thống kê</h4>
                                <p>Theo dõi tổng quan hoạt động, sản lượng theo mùa, tỷ lệ tuân thủ và điểm uy tín của các nông dân.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section: Dành cho Người tiêu dùng */}
            <div className="section" id="consumer">
                <div className="section-header">
                    <h2 className="section-title">
                        <span>🛒</span> Hướng dẫn dành cho Người tiêu dùng
                    </h2>
                </div>

                <div className="content-grid">
                    <div className="glass-card">
                        <div className="card-header">
                            <h3 className="card-title">
                                <span className="icon">📱</span>
                                Quét mã QR
                            </h3>
                        </div>
                        <div className="card-body">
                            <div className="guide-step">
                                <span className="step-number">1</span>
                                <div className="step-content">
                                    <h4>Mở camera điện thoại</h4>
                                    <p>Sử dụng ứng dụng Camera hoặc ứng dụng quét QR bất kỳ</p>
                                </div>
                            </div>
                            <div className="guide-step">
                                <span className="step-number">2</span>
                                <div className="step-content">
                                    <h4>Quét mã trên sản phẩm</h4>
                                    <p>Hướng camera vào mã QR trên nhãn sầu riêng</p>
                                </div>
                            </div>
                            <div className="guide-step">
                                <span className="step-number">3</span>
                                <div className="step-content">
                                    <h4>Xem thông tin truy xuất</h4>
                                    <p>Trang web hiển thị đầy đủ lịch sử canh tác và nguồn gốc</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card">
                        <div className="card-header">
                            <h3 className="card-title">
                                <span className="icon">🔍</span>
                                Nhập mã thủ công
                            </h3>
                        </div>
                        <div className="card-body">
                            <div className="guide-step">
                                <span className="step-number">1</span>
                                <div className="step-content">
                                    <h4>Truy cập trang Truy xuất</h4>
                                    <p>Vào menu "Truy xuất" hoặc truy cập trực tiếp /trace</p>
                                </div>
                            </div>
                            <div className="guide-step">
                                <span className="step-number">2</span>
                                <div className="step-content">
                                    <h4>Nhập mã lô hàng</h4>
                                    <p>Gõ mã in trên nhãn sản phẩm (VD: BATCH-2026-001)</p>
                                </div>
                            </div>
                            <div className="guide-step">
                                <span className="step-number">3</span>
                                <div className="step-content">
                                    <h4>Xem kết quả</h4>
                                    <p>Timeline chi tiết các hoạt động canh tác được hiển thị</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section: FAQ */}
            <div className="section" id="faq">
                <div className="section-header">
                    <h2 className="section-title">
                        <span>❓</span> Câu hỏi thường gặp (FAQ)
                    </h2>
                </div>

                <div className="content-grid" style={{ gridTemplateColumns: '1fr' }}>
                    <div className="glass-card">
                        <div className="card-header">
                            <h3 className="card-title">
                                <span className="icon">🤔</span>
                                Tại sao phải sử dụng DurianQR?
                            </h3>
                        </div>
                        <div className="card-body">
                            <p style={{ lineHeight: '1.8' }}>
                                DurianQR giúp minh bạch hóa quy trình canh tác, đảm bảo an toàn thực phẩm và tăng giá trị sản phẩm.
                                Khi xuất khẩu, nếu có vấn đề về dư lượng thuốc BVTV, hệ thống giúp xác định chính xác nguồn gốc để xử lý,
                                tránh ảnh hưởng đến toàn bộ lô hàng.
                            </p>
                        </div>
                    </div>

                    <div className="glass-card">
                        <div className="card-header">
                            <h3 className="card-title">
                                <span className="icon">💰</span>
                                Chi phí sử dụng như thế nào?
                            </h3>
                        </div>
                        <div className="card-body">
                            <p style={{ lineHeight: '1.8' }}>
                                Nông dân được sử dụng <strong>miễn phí</strong> các tính năng ghi nhật ký và xem thông tin.
                                Hợp tác xã và doanh nghiệp có các gói dịch vụ phù hợp với quy mô hoạt động.
                                Liên hệ hotline để được tư vấn chi tiết.
                            </p>
                        </div>
                    </div>

                    <div className="glass-card">
                        <div className="card-header">
                            <h3 className="card-title">
                                <span className="icon">🔒</span>
                                Dữ liệu của tôi có an toàn không?
                            </h3>
                        </div>
                        <div className="card-body">
                            <p style={{ lineHeight: '1.8' }}>
                                Chúng tôi áp dụng các tiêu chuẩn bảo mật cao nhất. Dữ liệu được mã hóa và lưu trữ trên hệ thống đám mây an toàn.
                                Thông tin cá nhân (SĐT, địa chỉ) sẽ <strong>không được hiển thị</strong> khi người tiêu dùng quét QR -
                                chỉ hiển thị thông tin về quy trình canh tác.
                            </p>
                        </div>
                    </div>

                    <div className="glass-card">
                        <div className="card-header">
                            <h3 className="card-title">
                                <span className="icon">📞</span>
                                Tôi cần hỗ trợ thì liên hệ ai?
                            </h3>
                        </div>
                        <div className="card-body">
                            <p style={{ lineHeight: '1.8' }}>
                                Bạn có thể liên hệ qua:
                            </p>
                            <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem', lineHeight: '2' }}>
                                <li><strong>Hotline:</strong> 1900 xxxx xx (8:00 - 17:00)</li>
                                <li><strong>Email:</strong> support@durianqr.vn</li>
                                <li><strong>Zalo:</strong> 0909 xxx xxx</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="hero-section" style={{ marginTop: '3rem' }}>
                <span className="hero-icon">🚀</span>
                <h2 className="hero-title">Sẵn sàng bắt đầu?</h2>
                <p className="hero-description">
                    Tham gia ngay hôm nay để trải nghiệm hệ thống truy xuất nguồn gốc hiện đại
                </p>
                <div className="btn-group" style={{ justifyContent: 'center' }}>
                    <Link to="/register" className="btn btn-accent btn-lg">
                        📝 Đăng ký miễn phí
                    </Link>
                    <Link to="/trace" className="btn btn-outline btn-lg">
                        🔍 Thử truy xuất
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="page-footer">
                <div className="footer-logo">🍈</div>
                <p className="footer-text">DurianQR - Hệ thống truy xuất nguồn gốc sầu riêng</p>
                <p className="footer-text">© 2026 DurianQR. Bản quyền thuộc về HUTECH.</p>
                <div className="footer-links">
                    <Link to="/" className="footer-link">Trang chủ</Link>
                    <Link to="/trace" className="footer-link">Truy xuất</Link>
                    <a href="#" className="footer-link">Chính sách bảo mật</a>
                    <a href="#" className="footer-link">Điều khoản sử dụng</a>
                </div>
            </footer>
        </div>
    );
};

export default GuidePage;
