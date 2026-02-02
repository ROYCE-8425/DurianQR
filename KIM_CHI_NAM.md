# 🧭 Kim Chỉ Nam - DurianQR (Nhật Ký Nông Vụ Số)

> **"Minh bạch hóa dòng chảy của quả sầu riêng từ nông trại đến bàn ăn"**

File này là **kim chỉ nam** cho toàn bộ dự án. Mọi thành viên trong team cần đọc và nắm rõ trước khi bắt đầu code.

---

## 📋 Mục Lục

1. [Tổng Quan & Mục Tiêu](#-tổng-quan--mục-tiêu)
2. [Phân Tích Bài Toán Nghiệp Vụ](#-phân-tích-bài-toán-nghiệp-vụ)
3. [Kiến Trúc Hệ Thống](#-kiến-trúc-hệ-thống)
4. [Thiết Kế Database (ERD)](#-thiết-kế-database-erd)
5. [Các Module Chức Năng](#-các-module-chức-năng)
6. [Kế Hoạch Triển Khai](#-kế-hoạch-triển-khai)
7. [Tech Stack](#-tech-stack)
8. [Quy Tắc Phát Triển](#-quy-tắc-phát-triển)
9. [Changelog](#-changelog)

---

## 🎯 Tổng Quan & Mục Tiêu

### Thông tin dự án

| Thuộc tính       | Giá trị                                          |
| ---------------- | ------------------------------------------------ |
| **Tên dự án**    | DurianQR - Nhật Ký Nông Vụ Số                    |
| **Phiên bản**    | 1.0.0 (Đang phát triển)                          |
| **Đối tượng**    | Nông dân, Hợp tác xã, Hải quan, Người tiêu dùng  |
| **Độ khó**       | 7.5/10                                           |
| **Tiềm năng**    | Đồ án tốt nghiệp, Nghiên cứu khoa học            |

### Mục tiêu cốt lõi

```
🌱 Ra hoa → 🧪 Bón phân → 💧 Tưới nước → 🐛 Phun thuốc → 🍈 Thu hoạch → 📦 Đóng gói → ✈️ Xuất khẩu
                                    ↓
                              📱 QUÉT QR CODE
                                    ↓
                        📊 XEM TOÀN BỘ LỊCH SỬ CANH TÁC
```

**Mục tiêu chính:**
1. **Truy xuất nguồn gốc** - Từ mã QR có thể biết quả sầu riêng đến từ hộ nào, thửa đất nào
2. **Đảm bảo an toàn thực phẩm** - Cảnh báo nếu thu hoạch trước thời gian cách ly thuốc BVTV
3. **Tuân thủ tiêu chuẩn** - Hỗ trợ VietGAP/GlobalGAP cho xuất khẩu
4. **Minh bạch thông tin** - Người tiêu dùng có thể kiểm tra nguồn gốc sản phẩm

---

## 🔍 Phân Tích Bài Toán Nghiệp Vụ

### Nỗi đau hiện tại (Pain Points)

```
❌ QUY TRÌNH CŨ (THỦ CÔNG)
┌─────────────────────────────────────────────────────────────────────────────┐
│  Nông dân       →  Ghi sổ tay    →  Lái thương     →  Trộn chung   →  Xuất  │
│  phun thuốc        (hoặc quên)      gom 10 hộ         1 xe            khẩu  │
└─────────────────────────────────────────────────────────────────────────────┘
                              ↓
                    🚨 HẢI QUAN PHÁT HIỆN DƯ LƯỢNG THUỐC
                              ↓
            ┌─────────────────────────────────────────────┐
            │  • Trả về TOÀN BỘ lô hàng (thiệt hại tỷ đồng) │
            │  • Cấm cửa mã số vùng trồng                  │
            │  • KHÔNG BIẾT quả lỗi từ hộ nào!             │
            └─────────────────────────────────────────────┘
```

### Giải pháp DurianQR

```
✅ QUY TRÌNH MỚI (SỐ HÓA)
┌─────────────────────────────────────────────────────────────────────────────┐
│  Nông dân       →  Ghi nhật ký   →  Hệ thống      →  Tạo lô hàng  →  Xuất  │
│  phun thuốc        trên APP         KIỂM TRA         + MÃ QR         khẩu  │
│                                     THỜI GIAN                              │
│                                     CÁCH LY                                │
└─────────────────────────────────────────────────────────────────────────────┘
                              ↓
                    🔍 QUÉT MÃ QR BẤT KỲ LÚC NÀO
                              ↓
            ┌─────────────────────────────────────────────┐
            │  • Biết chính xác từ thửa đất nào           │
            │  • Xem toàn bộ lịch sử canh tác             │
            │  • Xác định trách nhiệm rõ ràng             │
            └─────────────────────────────────────────────┘
```

---

## 🏗 Kiến Trúc Hệ Thống

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├─────────────────┬────────────────────────┬───────────────────────────────────┤
│   📱 Mobile     │     💻 Admin Web       │      🌐 Public View              │
│   (Nông dân)    │   (Hợp tác xã)         │   (Người tiêu dùng)              │
│                 │                        │                                   │
│ • Ghi nhật ký   │ • Quản lý vùng trồng   │ • Quét QR Code                   │
│ • Xem cảnh báo  │ • Tạo lô hàng          │ • Xem Timeline                   │
│ • Chụp ảnh      │ • Báo cáo thống kê     │ • Xác thực sản phẩm              │
└─────────────────┴────────────────────────┴───────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER                                       │
│                        (.NET Core Web API)                                   │
├──────────────────────────────────────────────────────────────────────────────┤
│  🔐 Authentication  │  📝 Farming Logs  │  📦 Batch Management  │  🔍 QR    │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                                      │
│                           (MySQL Database)                                   │
├──────────────────────────────────────────────────────────────────────────────┤
│  Farmers  │  LandPlots  │  FarmingLogs  │  Harvests  │  Batches  │  QRCodes │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 🗄 Thiết Kế Database (ERD)

### Sơ đồ quan hệ

```
┌─────────────┐       ┌─────────────┐       ┌─────────────────┐
│   Farmers   │──1:N──│  LandPlots  │──1:N──│   FarmingLogs   │
│─────────────│       │─────────────│       │─────────────────│
│ FarmerID    │       │ PlotID      │       │ LogID           │
│ FullName    │       │ FarmerID    │       │ PlotID          │
│ Phone       │       │ Area        │       │ ActivityType    │
│ Address     │       │ PlantType   │       │ ProductUsed     │
│ PlantingCode│       │ Coordinates │       │ Quantity        │
│ CreatedAt   │       │ IsActive    │       │ ImageProof      │
└─────────────┘       └─────────────┘       │ Timestamp ⚠️    │
                                            │ Notes           │
                                            └─────────────────┘
                                                    │
                                                   N:M
                                                    │
┌─────────────────┐       ┌─────────────────┐       ▼
│    Batches      │──1:N──│   BatchItems    │──────────────────┐
│─────────────────│       │─────────────────│                  │
│ BatchID         │       │ BatchItemID     │                  │
│ BatchCode       │       │ BatchID         │   ┌──────────────▼──┐
│ ExportDate      │       │ HarvestID       │   │    Harvests     │
│ Destination     │       │ Quantity        │   │─────────────────│
│ Status          │       └─────────────────┘   │ HarvestID       │
│ QRCodeData      │                             │ PlotID          │
└─────────────────┘                             │ HarvestDate     │
                                                │ Quantity        │
                                                │ Quality         │
                                                │ IsApproved ⚠️   │
                                                └─────────────────┘

⚠️ = Cần TRIGGER/CONSTRAINT đặc biệt
```

### Chi tiết các bảng

#### 1. Bảng `Farmers` (Nông dân)
```sql
CREATE TABLE Farmers (
    FarmerID        INT PRIMARY KEY AUTO_INCREMENT,
    FullName        NVARCHAR(100) NOT NULL,
    Phone           VARCHAR(15) UNIQUE NOT NULL,
    Address         NVARCHAR(255),
    PlantingCode    VARCHAR(20) UNIQUE,          -- Mã số vùng trồng
    CertificationType ENUM('None', 'VietGAP', 'GlobalGAP'),
    ReputationScore INT DEFAULT 0,               -- Điểm uy tín
    CreatedAt       DATETIME DEFAULT NOW(),
    UpdatedAt       DATETIME ON UPDATE NOW()
);
```

#### 2. Bảng `LandPlots` (Thửa đất)
```sql
CREATE TABLE LandPlots (
    PlotID          INT PRIMARY KEY AUTO_INCREMENT,
    FarmerID        INT NOT NULL,
    PlotCode        VARCHAR(20) UNIQUE,
    AreaHectares    DECIMAL(10,2),
    PlantType       ENUM('Durian', 'Mango', 'Other'),
    TreeCount       INT,
    PlantingYear    YEAR,
    Latitude        DECIMAL(10,8),
    Longitude       DECIMAL(11,8),
    IsActive        BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (FarmerID) REFERENCES Farmers(FarmerID)
);
```

#### 3. Bảng `FarmingLogs` (Nhật ký canh tác) ⭐ QUAN TRỌNG NHẤT
```sql
CREATE TABLE FarmingLogs (
    LogID           INT PRIMARY KEY AUTO_INCREMENT,
    PlotID          INT NOT NULL,
    ActivityType    ENUM('Fertilizing', 'Watering', 'Pesticide', 'Pruning', 'Flowering', 'Other'),
    ProductUsed     NVARCHAR(100),               -- Tên thuốc/phân
    ProductBrand    NVARCHAR(100),               -- Thương hiệu
    Quantity        DECIMAL(10,2),
    Unit            VARCHAR(20),                  -- kg, lít, ml
    ImageProof      VARCHAR(255),                -- URL ảnh chụp vỏ thuốc
    Timestamp       DATETIME NOT NULL,           -- ⚠️ Thời gian thực, KHÔNG cho sửa
    SafetyDays      INT DEFAULT 7,               -- Thời gian cách ly an toàn
    Notes           TEXT,
    
    CreatedAt       DATETIME DEFAULT NOW(),      -- Thời gian tạo record
    
    FOREIGN KEY (PlotID) REFERENCES LandPlots(PlotID),
    
    -- ĐẢM BẢO KHÔNG GHI LÙI NGÀY
    CHECK (Timestamp <= NOW())
);
```

#### 4. Bảng `Harvests` (Thu hoạch)
```sql
CREATE TABLE Harvests (
    HarvestID       INT PRIMARY KEY AUTO_INCREMENT,
    PlotID          INT NOT NULL,
    HarvestDate     DATE NOT NULL,
    QuantityKg      DECIMAL(10,2),
    QualityGrade    ENUM('A', 'B', 'C'),
    IsApproved      BOOLEAN DEFAULT FALSE,       -- ⚠️ Chỉ TRUE nếu đủ thời gian cách ly
    ApprovedBy      INT,
    Notes           TEXT,
    
    FOREIGN KEY (PlotID) REFERENCES LandPlots(PlotID)
);
```

### SQL Nâng Cao

#### TRIGGER: Kiểm tra thời gian cách ly
```sql
DELIMITER //

CREATE TRIGGER CheckSafetyPeriod
BEFORE INSERT ON Harvests
FOR EACH ROW
BEGIN
    DECLARE last_pesticide_date DATETIME;
    DECLARE safety_days INT;
    
    -- Tìm lần phun thuốc gần nhất
    SELECT Timestamp, SafetyDays 
    INTO last_pesticide_date, safety_days
    FROM FarmingLogs 
    WHERE PlotID = NEW.PlotID 
      AND ActivityType = 'Pesticide'
    ORDER BY Timestamp DESC 
    LIMIT 1;
    
    -- Kiểm tra thời gian cách ly
    IF DATEDIFF(NEW.HarvestDate, last_pesticide_date) < safety_days THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = '🚫 CẢNH BÁO: Chưa đủ thời gian cách ly an toàn sau phun thuốc!';
    END IF;
END //

DELIMITER ;
```

#### STORED PROCEDURE: Tạo dữ liệu QR Code
```sql
DELIMITER //

CREATE PROCEDURE GenerateQRCodeData(IN p_BatchID INT)
BEGIN
    SELECT JSON_OBJECT(
        'batch_code', b.BatchCode,
        'export_date', b.ExportDate,
        'destination', b.Destination,
        'items', (
            SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'farmer_name', f.FullName,
                    'planting_code', f.PlantingCode,
                    'plot_code', lp.PlotCode,
                    'harvest_date', h.HarvestDate,
                    'quantity_kg', bi.Quantity,
                    'quality', h.QualityGrade,
                    'farming_logs', (
                        SELECT JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'activity', fl.ActivityType,
                                'date', DATE(fl.Timestamp),
                                'product', fl.ProductUsed
                            )
                        )
                        FROM FarmingLogs fl
                        WHERE fl.PlotID = lp.PlotID
                          AND fl.Timestamp BETWEEN 
                              DATE_SUB(h.HarvestDate, INTERVAL 6 MONTH) 
                              AND h.HarvestDate
                    )
                )
            )
            FROM BatchItems bi
            JOIN Harvests h ON bi.HarvestID = h.HarvestID
            JOIN LandPlots lp ON h.PlotID = lp.PlotID
            JOIN Farmers f ON lp.FarmerID = f.FarmerID
            WHERE bi.BatchID = b.BatchID
        )
    ) AS QRData
    FROM Batches b
    WHERE b.BatchID = p_BatchID;
END //

DELIMITER ;
```

#### VIEW: Dữ liệu công khai (ẩn thông tin nhạy cảm)
```sql
CREATE VIEW Public_Durian_View AS
SELECT 
    b.BatchCode,
    b.ExportDate,
    f.PlantingCode,
    lp.PlotCode,
    lp.PlantType,
    h.HarvestDate,
    h.QualityGrade,
    -- ẨN: SĐT, địa chỉ, giá bán
    fl.ActivityType,
    fl.ProductUsed,
    DATE(fl.Timestamp) AS ActivityDate
FROM Batches b
JOIN BatchItems bi ON b.BatchID = bi.BatchID
JOIN Harvests h ON bi.HarvestID = h.HarvestID
JOIN LandPlots lp ON h.PlotID = lp.PlotID
JOIN Farmers f ON lp.FarmerID = f.FarmerID
JOIN FarmingLogs fl ON fl.PlotID = lp.PlotID;
```

#### FUNCTION: Tính điểm uy tín nông dân
```sql
DELIMITER //

CREATE FUNCTION CalculateReputationScore(p_FarmerID INT) 
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE log_count INT;
    DECLARE harvest_count INT;
    DECLARE approved_rate DECIMAL(5,2);
    DECLARE score INT;
    
    -- Đếm số lượng nhật ký
    SELECT COUNT(*) INTO log_count
    FROM FarmingLogs fl
    JOIN LandPlots lp ON fl.PlotID = lp.PlotID
    WHERE lp.FarmerID = p_FarmerID;
    
    -- Tỷ lệ harvest được duyệt
    SELECT 
        COUNT(*),
        AVG(CASE WHEN IsApproved THEN 100 ELSE 0 END)
    INTO harvest_count, approved_rate
    FROM Harvests h
    JOIN LandPlots lp ON h.PlotID = lp.PlotID
    WHERE lp.FarmerID = p_FarmerID;
    
    -- Tính điểm
    SET score = (log_count * 2) + (harvest_count * 5) + approved_rate;
    
    RETURN LEAST(score, 100); -- Max 100 điểm
END //

DELIMITER ;
```

---

## 📱 Các Module Chức Năng

### Module A: Nông Dân (Mobile Web)

| Chức năng               | Mô tả                                           | Độ ưu tiên |
| ----------------------- | ----------------------------------------------- | ---------- |
| Đăng ký/Đăng nhập       | Xác thực bằng SĐT + OTP                         | 🔴 Cao     |
| Ghi nhật ký canh tác    | Chọn hoạt động + nhập thông tin + chụp ảnh      | 🔴 Cao     |
| Xem lịch sử canh tác    | Timeline các hoạt động đã ghi                   | 🔴 Cao     |
| Cảnh báo thời gian cách ly | Thông báo khi chưa đủ thời gian an toàn       | 🔴 Cao     |
| Yêu cầu thu hoạch       | Tạo lệnh thu hoạch (có kiểm tra tự động)        | 🟡 TB      |
| Xem điểm uy tín         | Dashboard cá nhân                               | 🟢 Thấp    |

### Module B: Hợp Tác Xã (Admin Web)

| Chức năng               | Mô tả                                           | Độ ưu tiên |
| ----------------------- | ----------------------------------------------- | ---------- |
| Quản lý nông dân        | CRUD thông tin nông dân trong HTX               | 🔴 Cao     |
| Quản lý vùng trồng      | Giám sát mã số vùng trồng, tuân thủ GAP         | 🔴 Cao     |
| Duyệt yêu cầu thu hoạch | Kiểm tra và phê duyệt                           | 🔴 Cao     |
| Tạo lô hàng (Batching)  | Gom từ nhiều hộ → 1 lô xuất khẩu + tạo QR       | 🔴 Cao     |
| Báo cáo thống kê        | Dashboard tổng quan                             | 🟡 TB      |
| Quản lý sản phẩm BVTV   | Danh mục thuốc/phân được phép sử dụng           | 🟡 TB      |

### Module C: Công Khai (Public Web)

| Chức năng               | Mô tả                                           | Độ ưu tiên |
| ----------------------- | ----------------------------------------------- | ---------- |
| Quét mã QR              | Camera hoặc nhập mã thủ công                    | 🔴 Cao     |
| Xem Timeline canh tác   | Hiển thị dòng thời gian đẹp mắt                 | 🔴 Cao     |
| Xác thực sản phẩm       | Kiểm tra mã batch có hợp lệ không               | 🔴 Cao     |
| Đa ngôn ngữ             | Tiếng Việt / English / 中文                     | 🟢 Thấp    |

---

## 📅 Kế Hoạch Triển Khai

### Phase 1: Foundation (Tuần 1-2) 🔴

| STT | Công việc                              | Deadline   | Trạng thái  |
| --- | -------------------------------------- | ---------- | ----------- |
| 1   | Setup Database MySQL + Migration       | 05/02/2026 | ⏳ Đang làm |
| 2   | Xây dựng API Authentication            | 07/02/2026 | ⬜ Chưa làm |
| 3   | CRUD Farmers, LandPlots                | 09/02/2026 | ⬜ Chưa làm |
| 4   | Viết Trigger kiểm tra thời gian cách ly| 10/02/2026 | ⬜ Chưa làm |

### Phase 2: Core Features (Tuần 3-4) 🟡

| STT | Công việc                              | Deadline   | Trạng thái  |
| --- | -------------------------------------- | ---------- | ----------- |
| 5   | API FarmingLogs + Upload ảnh           | 14/02/2026 | ⬜ Chưa làm |
| 6   | API Harvests + Validation              | 17/02/2026 | ⬜ Chưa làm |
| 7   | UI Ghi nhật ký (Mobile-first)          | 21/02/2026 | ⬜ Chưa làm |
| 8   | UI Admin Dashboard                     | 24/02/2026 | ⬜ Chưa làm |

### Phase 3: QR & Public (Tuần 5-6) 🟢

| STT | Công việc                              | Deadline   | Trạng thái  |
| --- | -------------------------------------- | ---------- | ----------- |
| 9   | API Batches + QR Generation            | 28/02/2026 | ⬜ Chưa làm |
| 10  | Stored Procedure GenerateQRCodeData    | 01/03/2026 | ⬜ Chưa làm |
| 11  | UI Public View (Quét QR + Timeline)    | 05/03/2026 | ⬜ Chưa làm |
| 12  | Testing & Bug fixes                    | 10/03/2026 | ⬜ Chưa làm |

### Ký hiệu trạng thái

- ⬜ Chưa làm
- ⏳ Đang làm
- ✅ Hoàn thành
- ❌ Hủy/Tạm dừng
- 🔄 Cần review

---

## 🛠 Tech Stack

### Đã chọn

| Layer      | Công nghệ          | Lý do                                      |
| ---------- | ------------------ | ------------------------------------------ |
| Backend    | .NET Core 9 (C#)   | Mạnh về API, bảo mật tốt, type-safe        |
| Frontend   | React + Vite       | Nhanh, hiện đại, component-based           |
| Database   | MySQL              | Phổ biến, tận dụng kiến thức SQL           |
| ORM        | Entity Framework   | Tích hợp tốt với .NET                      |
| QR Code    | QRCoder library    | Đơn giản, hiệu quả                         |

### Cấu trúc thư mục

```
DurianQR/
├── 📁 backend/                    # .NET Core API
│   ├── Controllers/               # API Controllers
│   │   ├── AuthController.cs
│   │   ├── FarmersController.cs
│   │   ├── FarmingLogsController.cs
│   │   ├── HarvestsController.cs
│   │   └── QRController.cs
│   ├── Models/                    # Entity Models
│   ├── DTOs/                      # Data Transfer Objects
│   ├── Data/                      # DbContext
│   ├── Migrations/                # Database Migrations
│   └── Program.cs
│
├── 📁 frontend/                   # React + Vite
│   ├── src/
│   │   ├── components/            # Reusable UI Components
│   │   ├── pages/                 # Page Components
│   │   │   ├── farmer/            # Module Nông dân
│   │   │   ├── admin/             # Module Hợp tác xã
│   │   │   └── public/            # Module Công khai
│   │   ├── services/              # API Calls
│   │   ├── hooks/                 # Custom Hooks
│   │   └── utils/                 # Utilities
│   └── index.html
│
├── 📁 database/                   # SQL Scripts
│   ├── schema.sql                 # Tạo bảng
│   ├── triggers.sql               # Triggers
│   ├── procedures.sql             # Stored Procedures
│   └── seed-data.sql              # Dữ liệu mẫu
│
├── 📁 docs/                       # Tài liệu
│   ├── API.md                     # API Documentation
│   └── ERD.png                    # Sơ đồ Database
│
├── KIM_CHI_NAM.md                 # 👈 File này
├── HUONG_DAN_GIT.md
└── README.md
```

---

## 📐 Quy Tắc Phát Triển

### Git Workflow

```
main ─────●─────●─────●─────●──────────────→
           \                   ↑
            \                  │ merge
             \                 │
develop ──────●────●────●────●─┘
               \       ↑
                \      │ merge
                 \     │
feature/xxx ──────●────┘
```

### Branch Naming

- `feature/ten-chuc-nang` - Tính năng mới
- `bugfix/mo-ta-bug` - Sửa lỗi
- `hotfix/mo-ta` - Sửa lỗi khẩn cấp

### Commit Message Format

```
<type>: <description>

Types:
- feat: Tính năng mới
- fix: Sửa lỗi
- docs: Cập nhật tài liệu
- style: Format code
- refactor: Refactor code
- test: Thêm test
```

### API Naming Convention

```
GET     /api/farmers          # Lấy danh sách
GET     /api/farmers/{id}     # Lấy chi tiết
POST    /api/farmers          # Tạo mới
PUT     /api/farmers/{id}     # Cập nhật
DELETE  /api/farmers/{id}     # Xóa

# Nested resources
GET     /api/farmers/{id}/plots
GET     /api/plots/{id}/logs
```

---

## 🔄 Changelog

### [Unreleased]

#### Added
- Viết lại kim chỉ nam chi tiết (02/02/2026)
- Thiết kế ERD hoàn chỉnh
- Định nghĩa SQL Triggers, Stored Procedures
- Phân tích nghiệp vụ rõ ràng

#### Changed
- Cập nhật Tech Stack từ Laravel → .NET Core

### [v0.1.0] - 31/01/2026

- Khởi tạo dự án
- Setup cấu trúc thư mục cơ bản

---

## 💡 Ý Tưởng Mở Rộng (Future)

- [ ] Tích hợp IoT Sensor (đo độ ẩm, nhiệt độ)
- [ ] AI dự đoán thời điểm thu hoạch tối ưu
- [ ] Blockchain cho truy xuất nguồn gốc
- [ ] Mobile App Native (React Native/Flutter)
- [ ] Tích hợp thanh toán điện tử
- [ ] Export báo cáo PDF/Excel

---

## 📚 Tài Liệu Tham Khảo

- [Hướng dẫn Git](./HUONG_DAN_GIT.md)
- [API Documentation](./docs/API.md) *(Sẽ tạo)*
- [.NET Core Docs](https://docs.microsoft.com/dotnet)
- [React Docs](https://react.dev)
- [MySQL Docs](https://dev.mysql.com/doc/)

---

> 📌 **Lưu ý quan trọng:** 
> - Cập nhật file này **sau mỗi Sprint**
> - Mọi thành viên **phải đọc trước khi code**
> - Có thắc mắc → **hỏi ngay, đừng đoán!**

---

*Cập nhật lần cuối: 02/02/2026 bởi Team DurianQR* 🍈
