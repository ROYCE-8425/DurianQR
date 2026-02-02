import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

/**
 * QR Scanner Component - Quét QR bằng camera hoặc upload ảnh
 * @param {function} onScanSuccess - Callback khi quét thành công, trả về text từ QR
 * @param {function} onClose - Callback khi đóng scanner
 */
const QRScanner = ({ onScanSuccess, onClose }) => {
  const [mode, setMode] = useState('camera'); // 'camera' | 'upload'
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (mode === 'camera') {
      startCameraScanner();
    }
    return () => {
      stopScanner();
    };
  }, [mode]);

  const startCameraScanner = async () => {
    setError('');
    setIsScanning(true);
    
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode('qr-reader');
      }

      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      
      await html5QrCodeRef.current.start(
        { facingMode: 'environment' }, // Camera sau
        config,
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        () => {} // Ignore errors during scanning
      );
    } catch (err) {
      console.error('Camera error:', err);
      setError('Không thể truy cập camera. Vui lòng cho phép quyền truy cập hoặc thử tải ảnh lên.');
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (err) {
        console.error('Stop scanner error:', err);
      }
    }
  };

  const handleScanSuccess = (decodedText) => {
    stopScanner();
    
    // Extract batch code from URL or use as-is
    let batchCode = decodedText;
    
    // Parse URL pattern: https://durianqr.trannhuy.online/trace/{batchCode}
    const urlMatch = decodedText.match(/\/trace\/([^\/\?]+)/);
    if (urlMatch) {
      batchCode = urlMatch[1];
    }
    
    onScanSuccess(batchCode);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode('qr-reader-upload');
      }

      const result = await html5QrCodeRef.current.scanFile(file, true);
      handleScanSuccess(result);
    } catch (err) {
      console.error('Scan file error:', err);
      setError('Không thể đọc mã QR từ ảnh. Vui lòng thử ảnh khác.');
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>📷 Quét mã QR</h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        {/* Mode Tabs */}
        <div style={styles.tabs}>
          <button 
            style={{ ...styles.tab, ...(mode === 'camera' ? styles.tabActive : {}) }}
            onClick={() => setMode('camera')}
          >
            📹 Camera
          </button>
          <button 
            style={{ ...styles.tab, ...(mode === 'upload' ? styles.tabActive : {}) }}
            onClick={() => { stopScanner(); setMode('upload'); }}
          >
            📁 Tải ảnh lên
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div style={styles.error}>
            ⚠️ {error}
          </div>
        )}

        {/* Camera Mode */}
        {mode === 'camera' && (
          <div style={styles.scannerContainer}>
            <div id="qr-reader" style={styles.scanner} ref={scannerRef}></div>
            {isScanning && (
              <p style={styles.hint}>Hướng camera vào mã QR</p>
            )}
          </div>
        )}

        {/* Upload Mode */}
        {mode === 'upload' && (
          <div style={styles.uploadContainer}>
            <div id="qr-reader-upload" style={{ display: 'none' }}></div>
            
            <div 
              style={styles.dropZone}
              onClick={() => fileInputRef.current?.click()}
            >
              <div style={styles.dropIcon}>📸</div>
              <p style={styles.dropText}>Nhấn để chọn ảnh QR</p>
              <p style={styles.dropHint}>hoặc kéo thả ảnh vào đây</p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </div>
        )}

        {/* Cancel Button */}
        <button onClick={onClose} style={styles.cancelBtn}>
          Hủy
        </button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(10px)'
  },
  modal: {
    background: 'linear-gradient(145deg, #1a2f1a 0%, #0d1a0d 100%)',
    borderRadius: '24px',
    padding: '1.5rem',
    maxWidth: '400px',
    width: '95%',
    border: '1px solid rgba(76, 175, 80, 0.3)',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  title: {
    color: '#81C784',
    fontSize: '1.25rem',
    margin: 0
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: '#999',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.25rem'
  },
  tabs: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  tab: {
    flex: 1,
    padding: '0.75rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    color: '#999',
    cursor: 'pointer',
    fontSize: '0.95rem',
    transition: 'all 0.2s'
  },
  tabActive: {
    background: 'rgba(76, 175, 80, 0.2)',
    borderColor: '#4CAF50',
    color: '#81C784'
  },
  error: {
    background: 'rgba(244, 67, 54, 0.15)',
    border: '1px solid rgba(244, 67, 54, 0.3)',
    borderRadius: '12px',
    padding: '0.75rem 1rem',
    color: '#EF5350',
    marginBottom: '1rem',
    fontSize: '0.9rem'
  },
  scannerContainer: {
    textAlign: 'center'
  },
  scanner: {
    width: '100%',
    borderRadius: '16px',
    overflow: 'hidden',
    background: '#000'
  },
  hint: {
    color: '#81C784',
    marginTop: '1rem',
    fontSize: '0.9rem'
  },
  uploadContainer: {
    padding: '1rem 0'
  },
  dropZone: {
    border: '2px dashed rgba(76, 175, 80, 0.4)',
    borderRadius: '16px',
    padding: '2.5rem 1rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    background: 'rgba(76, 175, 80, 0.05)'
  },
  dropIcon: {
    fontSize: '3rem',
    marginBottom: '0.75rem'
  },
  dropText: {
    color: '#81C784',
    fontSize: '1rem',
    margin: '0 0 0.25rem'
  },
  dropHint: {
    color: '#666',
    fontSize: '0.85rem',
    margin: 0
  },
  cancelBtn: {
    width: '100%',
    padding: '0.875rem',
    background: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    color: '#999',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '1rem'
  }
};

export default QRScanner;
