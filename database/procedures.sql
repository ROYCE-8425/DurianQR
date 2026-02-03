-- =============================================================================
-- DurianQR - Stored Procedures
-- Các procedure hỗ trợ nghiệp vụ
-- Version: 1.0.0 | Created: 2026-02-03
-- =============================================================================

DELIMITER //

-- -----------------------------------------------------------------------------
-- PROCEDURE: Tạo dữ liệu QR Code cho lô hàng
-- Input: BatchID
-- Output: JSON chứa toàn bộ thông tin truy xuất nguồn gốc
-- -----------------------------------------------------------------------------
CREATE PROCEDURE GenerateQRCodeData(IN p_BatchID INT)
BEGIN
    SELECT JSON_OBJECT(
        'batch_code', b.BatchCode,
        'created_at', DATE_FORMAT(b.CreatedAt, '%Y-%m-%d %H:%i:%s'),
        'packing_date', DATE_FORMAT(b.PackingDate, '%Y-%m-%d'),
        'target_market', b.TargetMarket,
        'quality_grade', b.QualityGrade,
        'total_weight_kg', b.TotalWeight,
        'is_safe', b.IsSafe,
        'warehouse', JSON_OBJECT(
            'name', w.WarehouseName,
            'location', w.Location
        ),
        'harvest_sources', (
            SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'farmer_name', u.FullName,
                    'farm_name', f.FarmName,
                    'farm_location', f.Location,
                    'tree_code', t.TreeCode,
                    'variety', t.Variety,
                    'harvest_date', DATE_FORMAT(hr.ExpectedHarvestDate, '%Y-%m-%d'),
                    'actual_quantity_kg', hr.ActualQuantity,
                    'quality_grades', JSON_OBJECT(
                        'grade_a_kg', hr.GradeA_Quantity,
                        'grade_b_kg', hr.GradeB_Quantity,
                        'grade_c_kg', hr.GradeC_Quantity
                    ),
                    'farming_logs', (
                        SELECT JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'date', DATE_FORMAT(fl.LogDate, '%Y-%m-%d'),
                                'activity', fl.ActivityType,
                                'product', fl.ChemicalUsed,
                                'dosage', CONCAT(fl.DosageAmount, ' ', fl.Unit),
                                'is_safe', CASE WHEN fl.SafeAfterDate <= hr.ExpectedHarvestDate THEN TRUE ELSE FALSE END
                            )
                        )
                        FROM FarmingLogs fl
                        WHERE fl.TreeID = t.TreeID
                          AND fl.LogDate BETWEEN DATE_SUB(hr.ExpectedHarvestDate, INTERVAL 6 MONTH) AND hr.ExpectedHarvestDate
                        ORDER BY fl.LogDate DESC
                    )
                )
            )
            FROM BatchHarvestRequests bhr
            JOIN HarvestRequests hr ON bhr.RequestID = hr.RequestID
            JOIN DurianTrees t ON hr.TreeID = t.TreeID
            JOIN Farms f ON t.FarmID = f.FarmID
            JOIN Users u ON f.UserID = u.UserID
            WHERE bhr.BatchID = b.BatchID
        ),
        'verification', JSON_OBJECT(
            'qr_generated_at', NOW(),
            'verify_url', CONCAT('https://trannhuy.online/trace/', b.BatchCode)
        )
    ) AS QRData
    FROM ProductBatches b
    LEFT JOIN Warehouses w ON b.WarehouseID = w.WarehouseID
    WHERE b.BatchID = p_BatchID;
END //

-- -----------------------------------------------------------------------------
-- PROCEDURE: Tính điểm uy tín nông dân
-- Input: FarmerID (UserID)
-- Output: Điểm uy tín (0-100)
-- -----------------------------------------------------------------------------
CREATE PROCEDURE CalculateReputationScore(IN p_FarmerID INT, OUT p_Score INT)
BEGIN
    DECLARE log_count INT DEFAULT 0;
    DECLARE harvest_count INT DEFAULT 0;
    DECLARE approved_count INT DEFAULT 0;
    DECLARE approved_rate DECIMAL(5,2) DEFAULT 0;
    DECLARE violation_count INT DEFAULT 0;
    DECLARE score INT DEFAULT 0;
    
    -- Đếm số lượng nhật ký (mỗi log = 2 điểm, max 30)
    SELECT COUNT(*) INTO log_count
    FROM FarmingLogs fl
    JOIN DurianTrees t ON fl.TreeID = t.TreeID
    JOIN Farms f ON t.FarmID = f.FarmID
    WHERE f.UserID = p_FarmerID;
    
    -- Đếm số lượng harvest requests
    SELECT COUNT(*), 
           SUM(CASE WHEN Status IN ('Approved', 'CheckedIn', 'Completed') THEN 1 ELSE 0 END)
    INTO harvest_count, approved_count
    FROM HarvestRequests
    WHERE UserID = p_FarmerID;
    
    -- Tính tỷ lệ được duyệt
    IF harvest_count > 0 THEN
        SET approved_rate = (approved_count / harvest_count) * 100;
    END IF;
    
    -- Đếm số vi phạm PHI
    SELECT COUNT(*) INTO violation_count
    FROM HarvestRequests
    WHERE UserID = p_FarmerID
      AND JSON_EXTRACT(PHICheckResult, '$.warning') = TRUE;
    
    -- Tính điểm
    -- Log points: 2 điểm/log, max 30 điểm
    SET score = score + LEAST(log_count * 2, 30);
    -- Harvest points: 5 điểm/harvest hoàn thành, max 30 điểm  
    SET score = score + LEAST(approved_count * 5, 30);
    -- Approved rate bonus: max 30 điểm
    SET score = score + ROUND(approved_rate * 0.3);
    -- Consistency bonus: 10 điểm nếu không có vi phạm
    IF violation_count = 0 AND harvest_count > 0 THEN
        SET score = score + 10;
    END IF;
    -- Penalty: -5 điểm cho mỗi vi phạm
    SET score = score - (violation_count * 5);
    
    -- Đảm bảo score trong khoảng 0-100
    SET p_Score = GREATEST(0, LEAST(score, 100));
END //

-- -----------------------------------------------------------------------------
-- PROCEDURE: Lấy thống kê dashboard
-- -----------------------------------------------------------------------------
CREATE PROCEDURE GetDashboardStats()
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM Users WHERE Role = 'Farmer') AS total_farmers,
        (SELECT COUNT(*) FROM Farms) AS total_farms,
        (SELECT COUNT(*) FROM DurianTrees WHERE Status = 'Active') AS total_trees,
        (SELECT COUNT(*) FROM HarvestRequests WHERE Status = 'Pending') AS pending_requests,
        (SELECT COUNT(*) FROM HarvestRequests WHERE Status = 'Approved') AS approved_requests,
        (SELECT COUNT(*) FROM ProductBatches WHERE ExportStatus = 'InWarehouse') AS batches_in_warehouse,
        (SELECT COUNT(*) FROM ProductBatches WHERE ExportStatus = 'Shipped') AS batches_shipped,
        (SELECT SUM(TotalWeight) FROM ProductBatches WHERE MONTH(CreatedAt) = MONTH(NOW())) AS monthly_weight_kg,
        (SELECT COUNT(*) FROM FarmingLogs WHERE MONTH(LogDate) = MONTH(NOW())) AS monthly_logs;
END //

-- -----------------------------------------------------------------------------
-- PROCEDURE: Kiểm tra PHI cho cây trước khi thu hoạch
-- -----------------------------------------------------------------------------
CREATE PROCEDURE CheckTreePHI(IN p_TreeID INT, IN p_HarvestDate DATE)
BEGIN
    SELECT 
        fl.LogID,
        fl.LogDate,
        fl.ActivityType,
        fl.ChemicalUsed,
        fl.SafetyDays,
        fl.SafeAfterDate,
        DATEDIFF(p_HarvestDate, fl.LogDate) AS days_since_activity,
        CASE 
            WHEN fl.SafeAfterDate > p_HarvestDate THEN 'UNSAFE'
            ELSE 'SAFE'
        END AS safety_status,
        CASE 
            WHEN fl.SafeAfterDate > p_HarvestDate 
            THEN DATEDIFF(fl.SafeAfterDate, p_HarvestDate)
            ELSE 0
        END AS days_until_safe
    FROM FarmingLogs fl
    WHERE fl.TreeID = p_TreeID
      AND fl.ActivityType = 'Spraying'
      AND fl.SafetyDays IS NOT NULL
      AND fl.LogDate >= DATE_SUB(p_HarvestDate, INTERVAL 60 DAY)
    ORDER BY fl.LogDate DESC;
END //

DELIMITER ;

-- =============================================================================
-- Ví dụ sử dụng
-- =============================================================================
-- CALL GenerateQRCodeData(1);
-- CALL CalculateReputationScore(1, @score); SELECT @score;
-- CALL GetDashboardStats();
-- CALL CheckTreePHI(1, '2026-02-15');
