-- =============================================================================
-- DurianQR - Schema SQL (Reference/Backup)
-- Được generate từ Entity Framework Models
-- Version: 1.0.0 | Created: 2026-02-03
-- =============================================================================

-- NOTE: Schema chính được quản lý bởi EF Core Migrations
-- File này dùng để tham khảo và backup

-- -----------------------------------------------------------------------------
-- 1. Bảng Users (Người dùng: Nông dân, Thương lái, Admin)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    FullName NVARCHAR(100) NOT NULL,
    Phone VARCHAR(15),
    Email VARCHAR(100),
    Role VARCHAR(20) NOT NULL DEFAULT 'Farmer',  -- Farmer, Trader, Admin
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_role (Role),
    INDEX idx_email (Email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. Bảng Farms (Nông trại / Vườn)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Farms (
    FarmID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    FarmName NVARCHAR(100) NOT NULL,
    Location NVARCHAR(255),
    Area DECIMAL(10,2),           -- Diện tích (ha)
    Coordinates VARCHAR(100),      -- GPS coordinates
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    INDEX idx_user (UserID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. Bảng DurianTrees (Cây sầu riêng)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS DurianTrees (
    TreeID INT AUTO_INCREMENT PRIMARY KEY,
    FarmID INT NOT NULL,
    TreeCode VARCHAR(50) NOT NULL,     -- Mã định danh cây
    Variety VARCHAR(50),                -- Giống: Musang King, Monthong, Ri6
    PlantingYear INT,                   -- Năm trồng
    Status VARCHAR(20) DEFAULT 'Active', -- Active, Inactive, Removed
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (FarmID) REFERENCES Farms(FarmID) ON DELETE CASCADE,
    INDEX idx_treecode (TreeCode),
    INDEX idx_farm (FarmID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. Bảng Chemicals (Thuốc BVTV / Phân bón)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Chemicals (
    ChemicalID INT AUTO_INCREMENT PRIMARY KEY,
    ChemicalName NVARCHAR(100) NOT NULL,
    ActiveIngredient NVARCHAR(100),     -- Hoạt chất
    PHI_Days INT DEFAULT 14,            -- Pre-Harvest Interval (ngày cách ly)
    IsBanned BOOLEAN DEFAULT FALSE,      -- Bị cấm sử dụng
    TargetMarket VARCHAR(100),          -- VN, CN, EU...
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_name (ChemicalName)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. Bảng FarmingLogs (Nhật ký nông vụ) ⭐ QUAN TRỌNG NHẤT
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS FarmingLogs (
    LogID INT AUTO_INCREMENT PRIMARY KEY,
    TreeID INT NOT NULL,
    LogDate DATETIME NOT NULL,
    ActivityType VARCHAR(50) NOT NULL,  -- Spraying, Fertilizing, Watering, Pruning
    Description NVARCHAR(500),
    ChemicalUsed NVARCHAR(100),         -- Tên thuốc/phân
    ChemicalID INT,                      -- FK to Chemicals
    DosageAmount DECIMAL(10,2),          -- Liều lượng
    Unit VARCHAR(20),                    -- ml, g, kg, l
    SafetyDays INT,                      -- Số ngày cách ly (PHI)
    SafeAfterDate DATETIME,              -- Ngày an toàn sau khi phun
    ImagePath VARCHAR(255),              -- Ảnh chụp hoạt động
    IsAutoValidated BOOLEAN DEFAULT FALSE,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (TreeID) REFERENCES DurianTrees(TreeID) ON DELETE CASCADE,
    FOREIGN KEY (ChemicalID) REFERENCES Chemicals(ChemicalID) ON DELETE SET NULL,
    INDEX idx_logdate (LogDate),
    INDEX idx_activity (ActivityType),
    INDEX idx_tree (TreeID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. Bảng Warehouses (Kho / Hợp tác xã)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Warehouses (
    WarehouseID INT AUTO_INCREMENT PRIMARY KEY,
    WarehouseName NVARCHAR(100) NOT NULL,
    Location NVARCHAR(255),
    Coordinates VARCHAR(100),
    ManagerID INT,                       -- Thủ kho
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ManagerID) REFERENCES Users(UserID) ON DELETE SET NULL,
    INDEX idx_name (WarehouseName)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 7. Bảng HarvestRequests (Yêu cầu thu hoạch)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS HarvestRequests (
    RequestID INT AUTO_INCREMENT PRIMARY KEY,
    TreeID INT NOT NULL,
    UserID INT NOT NULL,                 -- Nông dân tạo yêu cầu
    RequestCode VARCHAR(50) NOT NULL UNIQUE, -- REQ-20260131-001
    RequestDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    ExpectedHarvestDate DATETIME NOT NULL,
    EstimatedQuantity DECIMAL(10,2),
    Status VARCHAR(20) DEFAULT 'Pending', -- Pending, Approved, Rejected, CheckedIn, Completed
    ApprovalNote NVARCHAR(500),
    PHICheckResult TEXT,                  -- JSON kết quả check PHI
    SafeAfterDate DATETIME,
    ApprovedAt DATETIME,
    ApprovedBy INT,
    CheckedInAt DATETIME,
    CheckedInBy INT,
    ActualQuantity DECIMAL(10,2),
    GradeA_Quantity DECIMAL(10,2),       -- Loại A (xuất khẩu)
    GradeB_Quantity DECIMAL(10,2),       -- Loại B (chế biến)
    GradeC_Quantity DECIMAL(10,2),       -- Loại C (dạt)
    CompletedAt DATETIME,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (TreeID) REFERENCES DurianTrees(TreeID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE RESTRICT,
    INDEX idx_status (Status),
    INDEX idx_requestcode (RequestCode),
    INDEX idx_harvest_date (ExpectedHarvestDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 8. Bảng ProductBatches (Lô sản phẩm xuất khẩu)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ProductBatches (
    BatchID INT AUTO_INCREMENT PRIMARY KEY,
    WarehouseID INT,
    BatchCode VARCHAR(50) NOT NULL UNIQUE, -- BATCH-20260131-001
    BatchType VARCHAR(20) DEFAULT 'Mixed',  -- Single / Mixed
    TotalWeight DECIMAL(10,2),
    GradeA_Weight DECIMAL(10,2),
    GradeB_Weight DECIMAL(10,2),
    GradeC_Weight DECIMAL(10,2),
    QualityGrade VARCHAR(50),              -- Premium, Standard, Economy
    TargetMarket NVARCHAR(100),            -- China, Japan, Domestic
    PackingDate DATETIME,
    ExportStatus VARCHAR(20) DEFAULT 'InWarehouse', -- InWarehouse, Packed, Shipped, Delivered
    IsSafe BOOLEAN DEFAULT TRUE,
    Notes NVARCHAR(500),
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    
    FOREIGN KEY (WarehouseID) REFERENCES Warehouses(WarehouseID) ON DELETE SET NULL,
    INDEX idx_batchcode (BatchCode),
    INDEX idx_status (ExportStatus)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 9. Bảng BatchHarvestRequests (Lô - Yêu cầu: M-N)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS BatchHarvestRequests (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    BatchID INT NOT NULL,
    RequestID INT NOT NULL,
    ContributedWeight DECIMAL(10,2),
    AddedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (BatchID) REFERENCES ProductBatches(BatchID) ON DELETE CASCADE,
    FOREIGN KEY (RequestID) REFERENCES HarvestRequests(RequestID) ON DELETE CASCADE,
    UNIQUE KEY unique_batch_request (BatchID, RequestID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 10. Bảng QRCodes (Mã QR cho lô hàng)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS QRCodes (
    QRID INT AUTO_INCREMENT PRIMARY KEY,
    BatchID INT NOT NULL,
    QRCodeData VARCHAR(500) NOT NULL,
    QRImagePath VARCHAR(255),
    GeneratedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    ScanCount INT DEFAULT 0,
    IsActive BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (BatchID) REFERENCES ProductBatches(BatchID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
