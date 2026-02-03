import { Link } from 'react-router-dom';
import SharedHeader, { SharedFooter } from '../components/SharedHeader';
import '../styles/shared-header.css';

const GuidePage = () => {
    return (
        <div className="shared-page-layout">
            <SharedHeader
                title="Hướng dẫn sử dụng"
                subtitle="Hướng dẫn chi tiết cách sử dụng hệ thống DurianQR"
                bannerIcon="📖"
                navType="public"
            />

            <div className="shared-page-body">
                <main className="shared-page-main">
                    {/* Quick Navigation */}
                    <div style={styles.quickNav}>
                        <a href="#farmer" style={styles.navCard}>
                            <span style={styles.navIcon}>👨‍🌾</span>
                            <span>Dành cho Nông dân</span>
                        </a>
                        <a href="#cooperative" style={styles.navCard}>
                            <span style={styles.navIcon}>🏢</span>
                            <span>Dành cho Hợp tác xã</span>
                        </a>
                        <a href="#consumer" style={styles.navCard}>
                            <span style={styles.navIcon}>🛒</span>
                            <span>Dành cho Người tiêu dùng</span>
                        </a>
                        <a href="#faq" style={styles.navCard}>
                            <span style={styles.navIcon}>❓</span>
                            <span>Câu hỏi thường gặp</span>
                        </a>
                    </div>

                    {/* Section: Dành cho Nông dân */}
                    <section id="farmer" style={styles.section}>
                        <h2 style={styles.sectionTitle}>👨‍🌾 Hướng dẫn dành cho Nông dân</h2>

                        <div style={styles.card}>
                            <div style={styles.cardHeader}>
                                <span style={styles.cardIcon}>📱</span>
                                <h3>Các bước sử dụng cơ bản</h3>
                            </div>
                            <div style={styles.stepsContainer}>
                                {[
                                    { num: 1, title: 'Đăng ký tài khoản', desc: 'Truy cập trang Đăng ký, nhập đầy đủ thông tin cá nhân và số điện thoại. Sau khi đăng ký thành công, bạn sẽ nhận được thông báo xác nhận.' },
                                    { num: 2, title: 'Thêm thông tin nông trại', desc: 'Vào mục Dashboard, chọn "Thêm nông trại mới". Nhập thông tin vùng trồng, diện tích canh tác, số lượng cây và loại giống sầu riêng.' },
                                    { num: 3, title: 'Ghi nhật ký canh tác hàng ngày', desc: 'Mỗi khi thực hiện các hoạt động như bón phân, tưới nước, phun thuốc BVTV, hãy ghi lại vào hệ thống. Chụp ảnh minh chứng để tăng độ tin cậy.' },
                                    { num: 4, title: 'Yêu cầu thu hoạch', desc: 'Khi sầu riêng đến thời điểm thu hoạch, vào mục "Xin thu hoạch" để đăng ký lô hàng. Hệ thống sẽ tự động kiểm tra thời gian cách ly an toàn.' },
                                    { num: 5, title: 'Nhận và in mã QR', desc: 'Sau khi lô hàng được phê duyệt, bạn có thể tạo và in mã QR để dán lên sản phẩm. Khách hàng quét mã sẽ thấy toàn bộ lịch sử canh tác.' },
                                ].map(step => (
                                    <div key={step.num} style={styles.step}>
                                        <span style={styles.stepNum}>{step.num}</span>
                                        <div style={styles.stepContent}>
                                            <h4 style={styles.stepTitle}>{step.title}</h4>
                                            <p style={styles.stepDesc}>{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ ...styles.card, ...styles.warningCard }}>
                            <div style={styles.cardHeader}>
                                <span style={styles.cardIcon}>⚠️</span>
                                <h3>Lưu ý quan trọng</h3>
                            </div>
                            <ul style={styles.list}>
                                <li>Ghi nhật ký <strong>đúng thời gian thực</strong> - Hệ thống không cho phép ghi lùi ngày</li>
                                <li>Đảm bảo <strong>thời gian cách ly</strong> sau khi phun thuốc (tối thiểu 7-14 ngày tùy loại thuốc)</li>
                                <li>Chụp ảnh <strong>vỏ thuốc/phân bón</strong> để làm minh chứng</li>
                                <li>Cập nhật đầy đủ thông tin để <strong>tăng điểm uy tín</strong> của bạn</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section: Dành cho Hợp tác xã */}
                    <section id="cooperative" style={styles.section}>
                        <h2 style={styles.sectionTitle}>🏢 Hướng dẫn dành cho Hợp tác xã</h2>

                        <div style={styles.card}>
                            <div style={styles.cardHeader}>
                                <span style={styles.cardIcon}>💼</span>
                                <h3>Quản lý và giám sát</h3>
                            </div>
                            <div style={styles.stepsContainer}>
                                {[
                                    { num: 1, title: 'Quản lý nông dân thành viên', desc: 'Thêm, sửa, xóa thông tin nông dân trong hợp tác xã. Theo dõi trạng thái tuân thủ VietGAP/GlobalGAP của từng hộ.' },
                                    { num: 2, title: 'Duyệt yêu cầu thu hoạch', desc: 'Kiểm tra các yêu cầu thu hoạch từ nông dân. Hệ thống sẽ tự động cảnh báo nếu chưa đủ thời gian cách ly an toàn.' },
                                    { num: 3, title: 'Tạo lô hàng xuất khẩu (Batching)', desc: 'Gom các lô nhỏ từ nhiều hộ nông dân thành một lô xuất khẩu. Hệ thống tự động liên kết dữ liệu truy xuất.' },
                                    { num: 4, title: 'Tạo và quản lý mã QR', desc: 'Sinh mã QR cho từng lô hàng. Mã QR chứa toàn bộ thông tin từ nông trại đến điểm xuất hàng.' },
                                    { num: 5, title: 'Xem báo cáo và thống kê', desc: 'Theo dõi tổng quan hoạt động, sản lượng theo mùa, tỷ lệ tuân thủ và điểm uy tín của các nông dân.' },
                                ].map(step => (
                                    <div key={step.num} style={styles.step}>
                                        <span style={styles.stepNum}>{step.num}</span>
                                        <div style={styles.stepContent}>
                                            <h4 style={styles.stepTitle}>{step.title}</h4>
                                            <p style={styles.stepDesc}>{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Section: Dành cho Người tiêu dùng */}
                    <section id="consumer" style={styles.section}>
                        <h2 style={styles.sectionTitle}>🛒 Hướng dẫn dành cho Người tiêu dùng</h2>

                        <div style={styles.cardsGrid}>
                            <div style={styles.card}>
                                <div style={styles.cardHeader}>
                                    <span style={styles.cardIcon}>📱</span>
                                    <h3>Quét mã QR</h3>
                                </div>
                                <div style={styles.stepsContainer}>
                                    <div style={styles.step}>
                                        <span style={styles.stepNum}>1</span>
                                        <div style={styles.stepContent}>
                                            <h4 style={styles.stepTitle}>Mở camera điện thoại</h4>
                                            <p style={styles.stepDesc}>Sử dụng ứng dụng Camera hoặc ứng dụng quét QR bất kỳ</p>
                                        </div>
                                    </div>
                                    <div style={styles.step}>
                                        <span style={styles.stepNum}>2</span>
                                        <div style={styles.stepContent}>
                                            <h4 style={styles.stepTitle}>Quét mã trên sản phẩm</h4>
                                            <p style={styles.stepDesc}>Hướng camera vào mã QR trên nhãn sầu riêng</p>
                                        </div>
                                    </div>
                                    <div style={styles.step}>
                                        <span style={styles.stepNum}>3</span>
                                        <div style={styles.stepContent}>
                                            <h4 style={styles.stepTitle}>Xem thông tin truy xuất</h4>
                                            <p style={styles.stepDesc}>Trang web hiển thị đầy đủ lịch sử canh tác và nguồn gốc</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={styles.card}>
                                <div style={styles.cardHeader}>
                                    <span style={styles.cardIcon}>🔍</span>
                                    <h3>Nhập mã thủ công</h3>
                                </div>
                                <div style={styles.stepsContainer}>
                                    <div style={styles.step}>
                                        <span style={styles.stepNum}>1</span>
                                        <div style={styles.stepContent}>
                                            <h4 style={styles.stepTitle}>Truy cập trang Truy xuất</h4>
                                            <p style={styles.stepDesc}>Vào menu "Truy xuất" hoặc truy cập trực tiếp /trace</p>
                                        </div>
                                    </div>
                                    <div style={styles.step}>
                                        <span style={styles.stepNum}>2</span>
                                        <div style={styles.stepContent}>
                                            <h4 style={styles.stepTitle}>Nhập mã lô hàng</h4>
                                            <p style={styles.stepDesc}>Gõ mã in trên nhãn sản phẩm (VD: BATCH-2026-001)</p>
                                        </div>
                                    </div>
                                    <div style={styles.step}>
                                        <span style={styles.stepNum}>3</span>
                                        <div style={styles.stepContent}>
                                            <h4 style={styles.stepTitle}>Xem kết quả</h4>
                                            <p style={styles.stepDesc}>Timeline chi tiết các hoạt động canh tác được hiển thị</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section: FAQ */}
                    <section id="faq" style={styles.section}>
                        <h2 style={styles.sectionTitle}>❓ Câu hỏi thường gặp (FAQ)</h2>

                        <div style={styles.faqContainer}>
                            {[
                                { icon: '🤔', q: 'Tại sao phải sử dụng DurianQR?', a: 'DurianQR giúp minh bạch hóa quy trình canh tác, đảm bảo an toàn thực phẩm và tăng giá trị sản phẩm. Khi xuất khẩu, nếu có vấn đề về dư lượng thuốc BVTV, hệ thống giúp xác định chính xác nguồn gốc để xử lý, tránh ảnh hưởng đến toàn bộ lô hàng.' },
                                { icon: '💰', q: 'Chi phí sử dụng như thế nào?', a: 'Nông dân được sử dụng miễn phí các tính năng ghi nhật ký và xem thông tin. Hợp tác xã và doanh nghiệp có các gói dịch vụ phù hợp với quy mô hoạt động. Liên hệ hotline để được tư vấn chi tiết.' },
                                { icon: '🔒', q: 'Dữ liệu của tôi có an toàn không?', a: 'Chúng tôi áp dụng các tiêu chuẩn bảo mật cao nhất. Dữ liệu được mã hóa và lưu trữ trên hệ thống đám mây an toàn. Thông tin cá nhân (SĐT, địa chỉ) sẽ không được hiển thị khi người tiêu dùng quét QR - chỉ hiển thị thông tin về quy trình canh tác.' },
                                { icon: '📞', q: 'Tôi cần hỗ trợ thì liên hệ ai?', a: 'Bạn có thể liên hệ qua: Hotline: 1900 xxxx xx (8:00 - 17:00) | Email: support@durianqr.vn | Zalo: 0909 xxx xxx' },
                            ].map((faq, i) => (
                                <div key={i} style={styles.faqCard}>
                                    <h3 style={styles.faqQuestion}>
                                        <span>{faq.icon}</span> {faq.q}
                                    </h3>
                                    <p style={styles.faqAnswer}>{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section style={styles.ctaSection}>
                        <span style={styles.ctaIcon}>🚀</span>
                        <h2 style={styles.ctaTitle}>Sẵn sàng bắt đầu?</h2>
                        <p style={styles.ctaDesc}>Tham gia ngay hôm nay để trải nghiệm hệ thống truy xuất nguồn gốc hiện đại</p>
                        <div style={styles.ctaButtons}>
                            <Link to="/register" style={styles.btnPrimary}>📝 Đăng ký miễn phí</Link>
                            <Link to="/trace" style={styles.btnOutline}>🔍 Thử truy xuất</Link>
                        </div>
                    </section>
                </main>
            </div>

            <SharedFooter />
        </div>
    );
};

const styles = {
    quickNav: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        marginBottom: '2rem',
    },
    navCard: {
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
        fontWeight: 600,
        fontSize: '0.875rem',
        transition: 'all 0.2s ease',
    },
    navIcon: { fontSize: '2rem' },
    section: {
        marginBottom: '3rem',
    },
    sectionTitle: {
        fontSize: '1.5rem',
        fontWeight: 700,
        color: '#1a1a1a',
        marginBottom: '1.5rem',
        paddingBottom: '0.75rem',
        borderBottom: '2px solid #2d5a27',
    },
    card: {
        background: '#ffffff',
        border: '1px solid #e5e5e5',
        borderRadius: '8px',
        overflow: 'hidden',
        marginBottom: '1.5rem',
    },
    cardHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '1rem 1.5rem',
        borderBottom: '1px solid #f0f0f0',
        background: '#fafafa',
    },
    cardIcon: { fontSize: '1.5rem' },
    warningCard: {
        borderColor: '#f59e0b',
        background: '#fffbeb',
    },
    stepsContainer: {
        padding: '1.5rem',
    },
    step: {
        display: 'flex',
        gap: '1rem',
        marginBottom: '1.25rem',
    },
    stepNum: {
        width: '32px',
        height: '32px',
        background: '#2d5a27',
        color: 'white',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.875rem',
        fontWeight: 700,
        flexShrink: 0,
    },
    stepContent: { flex: 1 },
    stepTitle: {
        fontSize: '1rem',
        fontWeight: 600,
        color: '#1a1a1a',
        margin: '0 0 0.25rem',
    },
    stepDesc: {
        fontSize: '0.9rem',
        color: '#555',
        margin: 0,
        lineHeight: 1.6,
    },
    list: {
        padding: '1rem 1.5rem 1.5rem 2.5rem',
        margin: 0,
        lineHeight: 2,
        color: '#555',
    },
    cardsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1.5rem',
    },
    faqContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    faqCard: {
        padding: '1.5rem',
        background: '#ffffff',
        border: '1px solid #e5e5e5',
        borderRadius: '8px',
    },
    faqQuestion: {
        fontSize: '1rem',
        fontWeight: 600,
        color: '#1a1a1a',
        margin: '0 0 0.75rem',
    },
    faqAnswer: {
        fontSize: '0.9rem',
        color: '#555',
        margin: 0,
        lineHeight: 1.7,
    },
    ctaSection: {
        textAlign: 'center',
        padding: '3rem',
        background: 'linear-gradient(135deg, #2d5a27 0%, #1b4d1a 100%)',
        borderRadius: '8px',
        color: 'white',
    },
    ctaIcon: { fontSize: '3rem', display: 'block', marginBottom: '1rem' },
    ctaTitle: { fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.75rem' },
    ctaDesc: { fontSize: '1rem', opacity: 0.9, margin: '0 0 1.5rem' },
    ctaButtons: {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
    },
    btnPrimary: {
        padding: '0.75rem 1.5rem',
        background: 'white',
        color: '#2d5a27',
        border: 'none',
        borderRadius: '4px',
        fontSize: '0.875rem',
        fontWeight: 600,
        textDecoration: 'none',
        cursor: 'pointer',
    },
    btnOutline: {
        padding: '0.75rem 1.5rem',
        background: 'transparent',
        color: 'white',
        border: '2px solid white',
        borderRadius: '4px',
        fontSize: '0.875rem',
        fontWeight: 600,
        textDecoration: 'none',
        cursor: 'pointer',
    },
};

export default GuidePage;
