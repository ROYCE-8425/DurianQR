import { useState } from 'react';
import SharedHeader, { SharedFooter } from '../components/SharedHeader';
import '../styles/shared-header.css';

const TraceabilityPage = () => {
    const [searchCode, setSearchCode] = useState('');

    // Demo data
    const demoData = {
        batch: { batchCode: 'DEMO-001', status: 'Completed', isSafe: true, harvestDate: '2026-01-15', quantity: 150, qualityGrade: 'Premium' },
        tree: { treeCode: 'TREE-001', variety: 'Musang King', plantingYear: 2018 },
        farm: { farmName: 'Nông trại Hùng Lộc', location: 'Đắk Lắk', area: 5.5 },
        farmer: { fullName: 'Nguyễn Văn An' },
        farmingHistory: [
            { date: '2026-01-01', activity: 'Bón phân', description: 'Bón phân NPK 16-16-8', chemical: null },
            { date: '2026-01-05', activity: 'Tưới nước', description: 'Tưới nước buổi sáng', chemical: null },
            { date: '2025-12-20', activity: 'Phun thuốc', description: 'Phun thuốc trừ sâu', chemical: 'Regent 800WP', dosage: '20ml/16L' },
            { date: '2025-12-15', activity: 'Tỉa cành', description: 'Tỉa cành già', chemical: null },
        ]
    };

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : 'N/A';

    return (
        <div className="shared-page-layout">
            <SharedHeader
                title="Truy xuất nguồn gốc"
                subtitle="DurianQR - Hệ thống truy xuất sầu riêng Việt Nam (Demo)"
                bannerIcon="🍈"
                navType="public"
            />

            <div className="shared-page-body">
                <main className="shared-page-main">
                    {/* Search Form */}
                    <div style={styles.searchForm}>
                        <input
                            type="text"
                            placeholder="Nhập mã lô hàng..."
                            value={searchCode}
                            onChange={(e) => setSearchCode(e.target.value)}
                            style={styles.searchInput}
                        />
                        <button style={styles.btnPrimary}>🔍 Tra cứu</button>
                    </div>

                    {/* Demo Badge */}
                    <div style={styles.demoBadge}>
                        📋 Đây là dữ liệu Demo để minh họa chức năng truy xuất
                    </div>

                    {/* Safety Badge */}
                    <div style={styles.safetyContainer}>
                        <div style={styles.safetyBadge}>
                            ✅ AN TOÀN - Đã qua thời gian cách ly
                        </div>
                    </div>

                    {/* Info Cards */}
                    <div style={styles.infoGrid}>
                        <div style={styles.card}>
                            <div style={styles.cardHeader}>📦 Thông tin Lô hàng</div>
                            <div style={styles.cardBody}>
                                <div style={styles.row}><span>Mã lô</span><strong style={{ color: '#2d5a27' }}>{demoData.batch.batchCode}</strong></div>
                                <div style={styles.row}><span>Trạng thái</span><span>{demoData.batch.status}</span></div>
                                <div style={styles.row}><span>Thu hoạch</span><span>{formatDate(demoData.batch.harvestDate)}</span></div>
                                <div style={styles.row}><span>Khối lượng</span><span>{demoData.batch.quantity} kg</span></div>
                                <div style={styles.row}><span>Phân loại</span><span>{demoData.batch.qualityGrade}</span></div>
                            </div>
                        </div>

                        <div style={styles.card}>
                            <div style={styles.cardHeader}>🌳 Thông tin Cây</div>
                            <div style={styles.cardBody}>
                                <div style={styles.row}><span>Mã cây</span><span>{demoData.tree.treeCode}</span></div>
                                <div style={styles.row}><span>Giống</span><strong style={{ color: '#e65100' }}>{demoData.tree.variety}</strong></div>
                                <div style={styles.row}><span>Năm trồng</span><span>{demoData.tree.plantingYear}</span></div>
                            </div>
                        </div>

                        <div style={styles.card}>
                            <div style={styles.cardHeader}>🏡 Nông trại</div>
                            <div style={styles.cardBody}>
                                <div style={styles.row}><span>Tên</span><span>{demoData.farm.farmName}</span></div>
                                <div style={styles.row}><span>Vị trí</span><span>{demoData.farm.location}</span></div>
                                <div style={styles.row}><span>Diện tích</span><span>{demoData.farm.area} ha</span></div>
                            </div>
                        </div>

                        <div style={styles.card}>
                            <div style={styles.cardHeader}>👨‍🌾 Nông dân</div>
                            <div style={styles.cardBody}>
                                <div style={styles.row}><span>Họ tên</span><span>{demoData.farmer.fullName}</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <section style={styles.section}>
                        <h2 style={styles.sectionTitle}>📋 Lịch sử canh tác</h2>
                        <div style={styles.card}>
                            <div style={styles.timeline}>
                                {demoData.farmingHistory.map((log, i) => (
                                    <div key={i} style={styles.timelineItem}>
                                        <div style={styles.timelineDot}></div>
                                        <div style={styles.timelineContent}>
                                            <div style={styles.timelineDate}>{formatDate(log.date)}</div>
                                            <div style={styles.timelineActivity}>{log.activity}</div>
                                            <div style={styles.timelineDesc}>{log.description}</div>
                                            {log.chemical && <span style={styles.chemicalBadge}>💊 {log.chemical}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Footer Text */}
                    <div style={styles.traceFooter}>
                        <p>🍈 DurianQR - Hệ thống truy xuất nguồn gốc sầu riêng</p>
                    </div>
                </main>
            </div>

            <SharedFooter />
        </div>
    );
};

const styles = {
    searchForm: { display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' },
    searchInput: { flex: 1, padding: '0.75rem 1rem', background: '#fff', border: '1px solid #e5e5e5', borderRadius: '4px', fontSize: '1rem' },
    btnPrimary: { padding: '0.75rem 1.5rem', background: '#2d5a27', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' },
    demoBadge: { padding: '1rem', background: '#e3f2fd', border: '1px solid #90caf9', borderRadius: '8px', color: '#1565c0', textAlign: 'center', marginBottom: '1.5rem' },
    safetyContainer: { textAlign: 'center', marginBottom: '2rem' },
    safetyBadge: { display: 'inline-flex', padding: '1rem 2rem', background: '#e8f5e9', border: '2px solid #4CAF50', borderRadius: '50px', color: '#2e7d32', fontWeight: 700, fontSize: '1.1rem' },
    infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2rem' },
    card: { background: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', overflow: 'hidden' },
    cardHeader: { padding: '1rem', borderBottom: '1px solid #f0f0f0', background: '#fafafa', fontWeight: 600 },
    cardBody: { padding: '1rem' },
    row: { display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', fontSize: '0.9rem', color: '#555', borderBottom: '1px solid #f5f5f5' },
    section: { marginBottom: '2rem' },
    sectionTitle: { fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e5e5e5' },
    timeline: { padding: '1.5rem', paddingLeft: '2rem' },
    timelineItem: { position: 'relative', paddingBottom: '1.5rem', paddingLeft: '1.5rem', borderLeft: '2px solid #c8e6c9' },
    timelineDot: { position: 'absolute', left: '-6px', top: '4px', width: '10px', height: '10px', background: '#4CAF50', borderRadius: '50%' },
    timelineContent: { paddingLeft: '0.5rem' },
    timelineDate: { fontSize: '0.8rem', color: '#888' },
    timelineActivity: { fontWeight: 600, color: '#2d5a27' },
    timelineDesc: { fontSize: '0.9rem', color: '#555' },
    chemicalBadge: { display: 'inline-block', background: '#fff3e0', color: '#e65100', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', marginTop: '0.5rem' },
    traceFooter: { textAlign: 'center', color: '#888', fontSize: '0.85rem' },
};

export default TraceabilityPage;
