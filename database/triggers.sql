-- =============================================================================
-- DurianQR - Triggers SQL
-- Kiểm tra tự động thời gian cách ly an toàn (PHI)
-- Version: 1.0.0 | Created: 2026-02-03
-- =============================================================================

DELIMITER //

-- -----------------------------------------------------------------------------
-- TRIGGER: Kiểm tra thời gian cách ly trước khi tạo yêu cầu thu hoạch
-- Ngăn không cho tạo HarvestRequest nếu chưa qua thời gian cách ly thuốc BVTV
-- -----------------------------------------------------------------------------
CREATE TRIGGER CheckSafetyPeriod_BeforeInsert
BEFORE INSERT ON HarvestRequests
FOR EACH ROW
BEGIN
    DECLARE last_pesticide_date DATETIME;
    DECLARE safety_days INT;
    DECLARE safe_after_date DATETIME;
    DECLARE days_since_spray INT;
    
    -- Tìm lần phun thuốc gần nhất của cây này
    SELECT LogDate, SafetyDays, SafeAfterDate
    INTO last_pesticide_date, safety_days, safe_after_date
    FROM FarmingLogs
    WHERE TreeID = NEW.TreeID
      AND ActivityType = 'Spraying'
      AND SafetyDays IS NOT NULL
    ORDER BY LogDate DESC
    LIMIT 1;
    
    -- Nếu có record phun thuốc
    IF last_pesticide_date IS NOT NULL THEN
        SET days_since_spray = DATEDIFF(NEW.ExpectedHarvestDate, last_pesticide_date);
        
        -- Nếu chưa đủ thời gian cách ly
        IF days_since_spray < safety_days THEN
            -- Lưu thông tin cảnh báo vào PHICheckResult (dạng JSON)
            SET NEW.PHICheckResult = JSON_OBJECT(
                'warning', TRUE,
                'lastSprayDate', DATE_FORMAT(last_pesticide_date, '%Y-%m-%d'),
                'safetyDays', safety_days,
                'daysSinceSpray', days_since_spray,
                'safeAfterDate', DATE_FORMAT(safe_after_date, '%Y-%m-%d'),
                'message', CONCAT('⚠️ Chưa đủ thời gian cách ly! Cần đợi thêm ', 
                                  (safety_days - days_since_spray), ' ngày.')
            );
            SET NEW.SafeAfterDate = safe_after_date;
            
            -- OPTION: Có thể throw error để chặn hoàn toàn
            -- SIGNAL SQLSTATE '45000'
            -- SET MESSAGE_TEXT = '🚫 Chưa đủ thời gian cách ly an toàn sau phun thuốc!';
        ELSE
            -- Đủ an toàn
            SET NEW.PHICheckResult = JSON_OBJECT(
                'warning', FALSE,
                'lastSprayDate', DATE_FORMAT(last_pesticide_date, '%Y-%m-%d'),
                'safetyDays', safety_days,
                'daysSinceSpray', days_since_spray,
                'message', '✅ Đủ thời gian cách ly, an toàn thu hoạch.'
            );
        END IF;
    ELSE
        -- Không có record phun thuốc
        SET NEW.PHICheckResult = JSON_OBJECT(
            'warning', FALSE,
            'message', '✅ Không có record phun thuốc gần đây.'
        );
    END IF;
END //

-- -----------------------------------------------------------------------------
-- TRIGGER: Cập nhật SafeAfterDate khi thêm FarmingLog phun thuốc
-- -----------------------------------------------------------------------------
CREATE TRIGGER UpdateSafeAfterDate_AfterInsert
AFTER INSERT ON FarmingLogs
FOR EACH ROW
BEGIN
    -- Nếu là hoạt động phun thuốc và có SafetyDays
    IF NEW.ActivityType = 'Spraying' AND NEW.SafetyDays IS NOT NULL THEN
        -- Có thể thêm logic cập nhật các yêu cầu đang pending
        -- hoặc gửi notification...
        
        -- Log vào bảng audit nếu cần
        -- INSERT INTO AuditLogs (TableName, RecordID, Action, Details, CreatedAt)
        -- VALUES ('FarmingLogs', NEW.LogID, 'INSERT_SPRAY', 
        --         CONCAT('SafeAfterDate: ', DATE_FORMAT(NEW.SafeAfterDate, '%Y-%m-%d')),
        --         NOW());
        
        SELECT 1; -- Placeholder
    END IF;
END //

-- -----------------------------------------------------------------------------
-- TRIGGER: Ngăn sửa ngày log (đảm bảo tính minh bạch)
-- -----------------------------------------------------------------------------
CREATE TRIGGER PreventLogDateModification
BEFORE UPDATE ON FarmingLogs
FOR EACH ROW
BEGIN
    -- Không cho phép sửa LogDate sau khi đã tạo (tính toàn vẹn dữ liệu)
    IF OLD.LogDate != NEW.LogDate THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = '🚫 Không được phép sửa ngày ghi nhật ký!';
    END IF;
    
    -- Không cho phép sửa CreatedAt
    IF OLD.CreatedAt != NEW.CreatedAt THEN
        SET NEW.CreatedAt = OLD.CreatedAt;
    END IF;
END //

-- -----------------------------------------------------------------------------
-- TRIGGER: Auto-update batch safety status
-- -----------------------------------------------------------------------------
CREATE TRIGGER UpdateBatchSafety_AfterInsert
AFTER INSERT ON BatchHarvestRequests
FOR EACH ROW
BEGIN
    DECLARE is_any_unsafe BOOLEAN;
    
    -- Kiểm tra xem có request nào không an toàn không
    SELECT EXISTS (
        SELECT 1 
        FROM BatchHarvestRequests bhr
        JOIN HarvestRequests hr ON bhr.RequestID = hr.RequestID
        WHERE bhr.BatchID = NEW.BatchID
          AND JSON_EXTRACT(hr.PHICheckResult, '$.warning') = TRUE
    ) INTO is_any_unsafe;
    
    -- Cập nhật trạng thái an toàn của batch
    UPDATE ProductBatches 
    SET IsSafe = NOT is_any_unsafe
    WHERE BatchID = NEW.BatchID;
END //

DELIMITER ;

-- =============================================================================
-- Xóa triggers (nếu cần reset)
-- =============================================================================
-- DROP TRIGGER IF EXISTS CheckSafetyPeriod_BeforeInsert;
-- DROP TRIGGER IF EXISTS UpdateSafeAfterDate_AfterInsert;
-- DROP TRIGGER IF EXISTS PreventLogDateModification;
-- DROP TRIGGER IF EXISTS UpdateBatchSafety_AfterInsert;
