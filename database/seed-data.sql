-- =============================================================================
-- DurianQR - Seed Data
-- Dữ liệu mẫu cho testing và demo
-- Version: 1.0.0 | Created: 2026-02-03
-- =============================================================================

-- NOTE: Entity Framework đã seed Chemicals và Warehouses trong DurianQRContext
-- File này bổ sung thêm dữ liệu sample cho testing

-- -----------------------------------------------------------------------------
-- Thêm Chemicals đầy đủ (PHI theo tiêu chuẩn xuất khẩu)
-- -----------------------------------------------------------------------------
INSERT INTO Chemicals (ChemicalName, ActiveIngredient, PHI_Days, IsBanned, TargetMarket) VALUES
-- Đã có từ EF Seed:
-- ('Abamectin', 'Abamectin 1.8%', 14, FALSE, 'VN,CN'),
-- ('Chlorpyrifos', 'Chlorpyrifos 48%', 21, TRUE, 'EU'),
-- ('Imidacloprid', 'Imidacloprid 10%', 14, FALSE, 'VN,CN'),
-- ('Mancozeb', 'Mancozeb 80%', 7, FALSE, 'VN'),
-- ('Thiamethoxam', 'Thiamethoxam 25%', 14, TRUE, 'EU'),

-- Bổ sung thêm:
('Cypermethrin', 'Cypermethrin 10%', 14, FALSE, 'VN,CN'),
('Fipronil', 'Fipronil 5%', 30, TRUE, 'EU,JP'),
('Lambda-cyhalothrin', 'Lambda-cyhalothrin 2.5%', 7, FALSE, 'VN,CN'),
('Carbendazim', 'Carbendazim 50%', 14, FALSE, 'VN'),
('Hexaconazole', 'Hexaconazole 5%', 14, FALSE, 'VN,CN'),
('Emamectin benzoate', 'Emamectin benzoate 5%', 7, FALSE, 'VN,CN,JP'),
('Spinosad', 'Spinosad 25%', 3, FALSE, 'VN,CN,EU,JP'),
('Azoxystrobin', 'Azoxystrobin 25%', 7, FALSE, 'VN,CN,EU')
ON DUPLICATE KEY UPDATE ChemicalName = ChemicalName;

-- -----------------------------------------------------------------------------
-- Sample Users (Nông dân, Thương lái, Admin)
-- Password: "password123" (BCrypt hash)
-- -----------------------------------------------------------------------------
INSERT INTO Users (Username, PasswordHash, FullName, Phone, Email, Role) VALUES
-- Admin
('admin', '$2a$11$8VBEKzU5ShGQQ5XGrFnFEeyxK7gQxQrZflhPFoGSV3dVWQQZxpjYW', 'Quản Trị Viên', '0901234567', 'admin@durianqr.vn', 'Admin'),

-- Farmers
('farmer1', '$2a$11$8VBEKzU5ShGQQ5XGrFnFEeyxK7gQxQrZflhPFoGSV3dVWQQZxpjYW', 'Nguyễn Văn An', '0912345678', 'an@email.com', 'Farmer'),
('farmer2', '$2a$11$8VBEKzU5ShGQQ5XGrFnFEeyxK7gQxQrZflhPFoGSV3dVWQQZxpjYW', 'Trần Thị Bình', '0923456789', 'binh@email.com', 'Farmer'),
('farmer3', '$2a$11$8VBEKzU5ShGQQ5XGrFnFEeyxK7gQxQrZflhPFoGSV3dVWQQZxpjYW', 'Lê Văn Cường', '0934567890', 'cuong@email.com', 'Farmer'),

-- Traders (Thương lái / Thủ kho)
('trader1', '$2a$11$8VBEKzU5ShGQQ5XGrFnFEeyxK7gQxQrZflhPFoGSV3dVWQQZxpjYW', 'Phạm Minh Đức', '0945678901', 'duc@email.com', 'Trader'),
('trader2', '$2a$11$8VBEKzU5ShGQQ5XGrFnFEeyxK7gQxQrZflhPFoGSV3dVWQQZxpjYW', 'Hoàng Thị Em', '0956789012', 'em@email.com', 'Trader')
ON DUPLICATE KEY UPDATE Username = Username;

-- -----------------------------------------------------------------------------
-- Sample Farms
-- -----------------------------------------------------------------------------
INSERT INTO Farms (UserID, FarmName, Location, Area, Coordinates) VALUES
-- Farmer 1's farms
((SELECT UserID FROM Users WHERE Username = 'farmer1'), 'Vườn Sầu Riêng An Phú', 'Xã Ea Phê, Huyện Krông Pắk, Đắk Lắk', 2.5, '12.7547,108.4563'),
((SELECT UserID FROM Users WHERE Username = 'farmer1'), 'Vườn An Lộc', 'Xã Ea Yông, Huyện Krông Pắk, Đắk Lắk', 1.8, '12.7612,108.4521'),

-- Farmer 2's farms  
((SELECT UserID FROM Users WHERE Username = 'farmer2'), 'Trang Trại Bình Minh', 'Xã Hòa Đông, Huyện Krông Pắk, Đắk Lắk', 3.2, '12.7489,108.4678'),

-- Farmer 3's farms
((SELECT UserID FROM Users WHERE Username = 'farmer3'), 'Vườn Cường Thịnh', 'Xã Ea Knuêc, Huyện Krông Pắk, Đắk Lắk', 4.0, '12.7634,108.4412')
ON DUPLICATE KEY UPDATE FarmName = FarmName;

-- -----------------------------------------------------------------------------
-- Sample DurianTrees
-- -----------------------------------------------------------------------------
INSERT INTO DurianTrees (FarmID, TreeCode, Variety, PlantingYear, Status) VALUES
-- Farm 1 trees
(1, 'AP-001', 'Monthong', 2018, 'Active'),
(1, 'AP-002', 'Monthong', 2018, 'Active'),
(1, 'AP-003', 'Ri6', 2019, 'Active'),
(1, 'AP-004', 'Musang King', 2020, 'Active'),

-- Farm 2 trees
(2, 'AL-001', 'Monthong', 2017, 'Active'),
(2, 'AL-002', 'Ri6', 2019, 'Active'),

-- Farm 3 trees
(3, 'BM-001', 'Monthong', 2016, 'Active'),
(3, 'BM-002', 'Monthong', 2016, 'Active'),
(3, 'BM-003', 'Musang King', 2019, 'Active'),

-- Farm 4 trees
(4, 'CT-001', 'Ri6', 2017, 'Active'),
(4, 'CT-002', 'Monthong', 2018, 'Active'),
(4, 'CT-003', 'Monthong', 2018, 'Active')
ON DUPLICATE KEY UPDATE TreeCode = TreeCode;

-- -----------------------------------------------------------------------------
-- Sample FarmingLogs (Recent activities)
-- -----------------------------------------------------------------------------
INSERT INTO FarmingLogs (TreeID, LogDate, ActivityType, Description, ChemicalUsed, ChemicalID, DosageAmount, Unit, SafetyDays, SafeAfterDate, IsAutoValidated) VALUES
-- Tree AP-001 logs
(1, DATE_SUB(NOW(), INTERVAL 30 DAY), 'Fertilizing', 'Bón phân NPK 20-20-15', 'NPK 20-20-15', NULL, 2.5, 'kg', NULL, NULL, FALSE),
(1, DATE_SUB(NOW(), INTERVAL 20 DAY), 'Spraying', 'Phun thuốc trừ sâu Abamectin', 'Abamectin', 1, 50, 'ml', 14, DATE_SUB(NOW(), INTERVAL 6 DAY), TRUE),
(1, DATE_SUB(NOW(), INTERVAL 10 DAY), 'Watering', 'Tưới nước theo lịch', NULL, NULL, 500, 'l', NULL, NULL, FALSE),
(1, DATE_SUB(NOW(), INTERVAL 5 DAY), 'Pruning', 'Cắt tỉa cành', NULL, NULL, NULL, NULL, NULL, NULL, FALSE),

-- Tree BM-001 logs
(7, DATE_SUB(NOW(), INTERVAL 25 DAY), 'Fertilizing', 'Bón phân hữu cơ', 'Phân hữu cơ vi sinh', NULL, 5, 'kg', NULL, NULL, FALSE),
(7, DATE_SUB(NOW(), INTERVAL 15 DAY), 'Spraying', 'Phun thuốc nấm Mancozeb', 'Mancozeb', 4, 100, 'g', 7, DATE_SUB(NOW(), INTERVAL 8 DAY), TRUE),
(7, DATE_SUB(NOW(), INTERVAL 7 DAY), 'Spraying', 'Phun Emamectin', 'Emamectin benzoate', NULL, 30, 'ml', 7, NOW(), TRUE);

-- -----------------------------------------------------------------------------
-- Sample HarvestRequests
-- -----------------------------------------------------------------------------
INSERT INTO HarvestRequests (TreeID, UserID, RequestCode, RequestDate, ExpectedHarvestDate, EstimatedQuantity, Status, PHICheckResult) VALUES
-- Completed request
(1, (SELECT UserID FROM Users WHERE Username = 'farmer1'), 'REQ-20260115-001', DATE_SUB(NOW(), INTERVAL 20 DAY), DATE_SUB(NOW(), INTERVAL 15 DAY), 50.0, 'Completed', '{"warning": false, "message": "✅ An toàn thu hoạch"}'),

-- Approved request
(7, (SELECT UserID FROM Users WHERE Username = 'farmer2'), 'REQ-20260125-001', DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_ADD(NOW(), INTERVAL 5 DAY), 80.0, 'Approved', '{"warning": false, "message": "✅ An toàn thu hoạch"}'),

-- Pending request
(10, (SELECT UserID FROM Users WHERE Username = 'farmer3'), 'REQ-20260201-001', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_ADD(NOW(), INTERVAL 10 DAY), 60.0, 'Pending', NULL);

-- -----------------------------------------------------------------------------
-- Update Warehouse Managers
-- -----------------------------------------------------------------------------
UPDATE Warehouses SET ManagerID = (SELECT UserID FROM Users WHERE Username = 'trader1') WHERE WarehouseID = 1;
UPDATE Warehouses SET ManagerID = (SELECT UserID FROM Users WHERE Username = 'trader2') WHERE WarehouseID = 2;

-- =============================================================================
-- Verify data
-- =============================================================================
-- SELECT * FROM Users;
-- SELECT * FROM Farms;
-- SELECT * FROM DurianTrees;
-- SELECT * FROM FarmingLogs;
-- SELECT * FROM HarvestRequests;
-- SELECT * FROM Chemicals;
