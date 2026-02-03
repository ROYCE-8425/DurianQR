import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/global.css';

const API_BASE = 'http://localhost:5000/api';

const FarmingLogPage = () => {
    const [logs, setLogs] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [chemicals, setChemicals] = useState([]);
    const [chemicalSuggestions, setChemicalSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [phiWarning, setPhiWarning] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        activityType: 'Fertilizing',
        productUsed: '',
        quantity: '',
        unit: 'kg',
        notes: '',
        safetyDays: null,
        imageFile: null
    });

    const activityTypes = [
        { value: 'Fertilizing', label: '🧪 Bón phân', color: '#4CAF50' },
        { value: 'Watering', label: '💧 Tưới nước', color: '#2196F3' },
        { value: 'Spraying', label: '🐛 Phun thuốc BVTV', color: '#FF9800' },
        { value: 'Pruning', label: '✂️ Tỉa cành', color: '#9C27B0' },
        { value: 'Flowering', label: '🌸 Ra hoa', color: '#E91E63' },
        { value: 'Other', label: '📝 Khác', color: '#607D8B' }
    ];

    // Load chemicals for autocomplete
    useEffect(() => {
        fetch(`${API_BASE}/chemicals`)
            .then(res => res.json())
            .then(data => setChemicals(data))
            .catch(err => console.log('Could not load chemicals'));
    }, []);

    // Search chemicals as user types
    const handleChemicalSearch = (value) => {
        setFormData({ ...formData, productUsed: value });

        if (value.length >= 2) {
            const matches = chemicals.filter(c => 
                c.chemicalName.toLowerCase().includes(value.toLowerCase()) ||
                (c.activeIngredient && c.activeIngredient.toLowerCase().includes(value.toLowerCase()))
            );
            setChemicalSuggestions(matches.slice(0, 5));
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    // Select a chemical from suggestions
    const selectChemical = (chemical) => {
        setFormData({ 
            ...formData, 
            productUsed: chemical.chemicalName,
            safetyDays: chemical.phi_Days
        });
        setShowSuggestions(false);

        // Show PHI warning
        if (chemical.isBanned) {
            setPhiWarning({
                type: 'danger',
                message: `⛔ CẢNH BÁO: ${chemical.chemicalName} đã bị CẤM sử dụng!`,
                days: null
            });
        } else if (chemical.phi_Days) {
            const safeDate = new Date();
            safeDate.setDate(safeDate.getDate() + chemical.phi_Days);
            setPhiWarning({
                type: 'warning',
                message: `⚠️ Thời gian cách ly: ${chemical.phi_Days} ngày`,
                safeDate: safeDate.toLocaleDateString('vi-VN'),
                days: chemical.phi_Days
            });
        }
    };

    // Handle image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, imageFile: file });
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove image
    const removeImage = () => {
        setFormData({ ...formData, imageFile: null });
        setImagePreview(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const newLog = {
            id: Date.now(),
            ...formData,
            timestamp: new Date().toISOString(),
            imagePath: imagePreview // In production, upload to server first
        };
        
        setLogs([newLog, ...logs]);
        setFormData({ activityType: 'Fertilizing', productUsed: '', quantity: '', unit: 'kg', notes: '', safetyDays: null, imageFile: null });
        setImagePreview(null);
        setPhiWarning(null);
        setShowForm(false);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    return (
        <div className="container" style={{ paddingBottom: '5rem' }}>
            {/* Header */}
            <div className="page-header flex justify-between items-center">
                <div>
                    <h1 className="page-title">📝 Nhật ký canh tác</h1>
                    <p className="page-subtitle">Ghi chép hoạt động chăm sóc cây hàng ngày</p>
                </div>
                <div>
                     {!showForm && (
                        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                            <span className="icon">➕</span> Thêm hoạt động
                        </button>
                     )}
                </div>
            </div>

            {/* Form thêm mới */}
            {showForm && (
                <div style={{ marginBottom: '2rem' }}>
                    <div className="card" style={{ maxWidth: '700px', margin: '0 auto', border: '1px solid var(--color-primary)' }}>
                        <div className="card-header bg-primary text-white">
                            <h3 className="card-title text-white">
                                Thêm hoạt động mới
                            </h3>
                        </div>
                        <div className="card-body">
                           <form onSubmit={handleSubmit}>
                                {/* Activity Type */}
                                <div className="form-group mb-4">
                                    <label className="form-label">Loại hoạt động</label>
                                    <select
                                        className="form-control"
                                        value={formData.activityType}
                                        onChange={(e) => {
                                            setFormData({ ...formData, activityType: e.target.value });
                                            setPhiWarning(null);
                                        }}
                                    >
                                        {activityTypes.map(type => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Product/Chemical Input with Autocomplete */}
                                {(formData.activityType === 'Fertilizing' || formData.activityType === 'Spraying') && (
                                    <div className="form-group mb-4" style={{ position: 'relative' }}>
                                        <label className="form-label flex justify-between">
                                            <span>Tên sản phẩm sử dụng</span>
                                            {formData.activityType === 'Spraying' && (
                                                <span className="text-warning text-sm">(Gõ để tìm thuốc)</span>
                                            )}
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.productUsed}
                                            onChange={(e) => handleChemicalSearch(e.target.value)}
                                            onFocus={() => formData.productUsed.length >= 2 && setShowSuggestions(true)}
                                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                            placeholder="VD: Abamectin, NPK 20-20-15..."
                                            autoComplete="off"
                                        />
                                        
                                        {/* Chemical Suggestions Dropdown */}
                                        {showSuggestions && chemicalSuggestions.length > 0 && (
                                            <div className="autocomplete-dropdown shadow-lg">
                                                {chemicalSuggestions.map(chem => (
                                                    <div
                                                        key={chem.chemicalID}
                                                        className="autocomplete-item p-3 border-b flex justify-between items-center cursor-pointer hover:bg-gray-50"
                                                        onClick={() => selectChemical(chem)}
                                                    >
                                                        <div>
                                                            <div className={`font-medium ${chem.isBanned ? 'text-danger' : 'text-dark'}`}>
                                                                {chem.isBanned && '⛔ '}{chem.chemicalName}
                                                            </div>
                                                            {chem.activeIngredient && (
                                                                <div className="text-muted text-sm">
                                                                    {chem.activeIngredient}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span className={`badge ${chem.isBanned ? 'badge-danger' : 'badge-warning'}`}>
                                                            {chem.isBanned ? 'CẤM' : `${chem.phi_Days} ngày`}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* PHI Warning */}
                                {phiWarning && (
                                    <div className={`alert ${phiWarning.type === 'danger' ? 'alert-danger' : 'alert-warning'} mb-4`}>
                                        <div className="font-bold text-lg mb-1">
                                            {phiWarning.message}
                                        </div>
                                        {phiWarning.safeDate && (
                                            <div>
                                                📅 An toàn thu hoạch sau: <strong>{phiWarning.safeDate}</strong>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Quantity and Unit */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="form-group">
                                        <label className="form-label">Số lượng</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={formData.quantity}
                                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Đơn vị</label>
                                        <select
                                            className="form-control"
                                            value={formData.unit}
                                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                        >
                                            <option value="kg">kg</option>
                                            <option value="lít">lít</option>
                                            <option value="ml">ml</option>
                                            <option value="g">g</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Image Upload */}
                                <div className="form-group mb-4">
                                    <label className="form-label">📸 Ảnh minh chứng</label>
                                    
                                    {!imagePreview ? (
                                        <label className="upload-box">
                                            <span className="text-4xl mb-2">📷</span>
                                            <span className="text-muted">Nhấn để chọn hoặc chụp ảnh</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                capture="environment"
                                                onChange={handleImageChange}
                                                style={{ display: 'none' }}
                                            />
                                        </label>
                                    ) : (
                                        <div className="relative inline-block">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="img-preview rounded-lg shadow-sm"
                                                style={{ maxHeight: '200px' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="btn-remove-img"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Notes */}
                                <div className="form-group mb-4">
                                    <label className="form-label">Ghi chú</label>
                                    <textarea
                                        className="form-control"
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        placeholder="Mô tả thêm..."
                                        rows={3}
                                    />
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex gap-3 mt-6">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary flex-1 py-3 text-lg" 
                                        disabled={phiWarning?.type === 'danger'}
                                    >
                                        Lưu hoạt động
                                    </button>
                                    <button type="button" className="btn btn-outline" onClick={() => {
                                        setShowForm(false);
                                        setPhiWarning(null);
                                        setImagePreview(null);
                                    }}>
                                        Hủy
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Cảnh báo phun thuốc */}
            {logs.some(log => log.activityType === 'Spraying' && log.safetyDays) && (
                <div className="alert alert-warning mb-4 shadow-sm flex items-center gap-4">
                    <span className="text-3xl">⚠️</span>
                    <div>
                        <h4 className="font-bold m-0">Lưu ý thời gian cách ly</h4>
                        <p className="m-0 text-sm">Bạn đã phun thuốc BVTV. Hệ thống sẽ tự động kiểm tra thời gian cách ly khi xuất hàng.</p>
                    </div>
                </div>
            )}

            {/* Lịch sử hoạt động */}
            <div>
                 <h2 className="section-title mb-4">Lịch sử hoạt động</h2>

                {logs.length === 0 ? (
                    <div className="text-center py-5 bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="text-4xl mb-3">📝</div>
                        <h3 className="text-xl font-bold mb-2">Chưa có hoạt động nào</h3>
                        <p className="text-muted mb-4">Ghi chép nhật ký giúp theo dõi quá trình canh tác tốt hơn.</p>
                        <button className="btn btn-outline-primary" onClick={() => setShowForm(true)}>
                            + Bắt đầu ghi nhật ký
                        </button>
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto space-y-4">
                        {logs.map((log) => {
                            const activity = activityTypes.find(t => t.value === log.activityType);
                            return (
                                <div
                                    key={log.id}
                                    className="card p-4 hover-lift"
                                    style={{ borderLeft: `5px solid ${activity?.color || '#4CAF50'}` }}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-bold text-lg text-dark m-0">
                                                    {activity?.label}
                                                </h3>
                                                {log.safetyDays && (
                                                    <span className="badge badge-warning">
                                                        PHI: {log.safetyDays}d
                                                    </span>
                                                )}
                                            </div>
                                            {log.productUsed && (
                                                <p className="mb-1 text-dark">
                                                    Sản phẩm: <strong>{log.productUsed}</strong>
                                                </p>
                                            )}
                                            {log.quantity && (
                                                <p className="mb-1 text-muted text-sm">
                                                    Số lượng: {log.quantity} {log.unit}
                                                </p>
                                            )}
                                            {log.notes && (
                                                <p className="text-muted italic text-sm mt-2 bg-gray-50 p-2 rounded">
                                                    "{log.notes}"
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm text-muted bg-gray-100 px-2 py-1 rounded">
                                                {formatDate(log.timestamp)}
                                            </span>
                                            {log.imagePath && (
                                                <div className="mt-2">
                                                    <img
                                                        src={log.imagePath}
                                                        alt="Proof"
                                                        className="w-20 h-16 object-cover rounded border border-gray-200"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FarmingLogPage;
