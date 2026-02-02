using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DurianQR.API.Models;

/// <summary>
/// Người dùng hệ thống (Nông dân, Thủ kho, Admin)
/// </summary>
public class User
{
    [Key]
    public int UserID { get; set; }

    [Required]
    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [MaxLength(15)]
    public string? Phone { get; set; }

    [MaxLength(100)]
    public string? Email { get; set; }

    [Required]
    [MaxLength(20)]
    public string Role { get; set; } = "Farmer"; // Farmer, Trader, Admin

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual ICollection<Farm> Farms { get; set; } = new List<Farm>();
    public virtual ICollection<HarvestRequest> HarvestRequests { get; set; } = new List<HarvestRequest>();
    public virtual Warehouse? ManagedWarehouse { get; set; }
}

/// <summary>
/// Nông trại / Vườn sầu riêng
/// </summary>
public class Farm
{
    [Key]
    public int FarmID { get; set; }

    [Required]
    public int UserID { get; set; }

    [Required]
    [MaxLength(100)]
    public string FarmName { get; set; } = string.Empty;

    [MaxLength(255)]
    public string? Location { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal? Area { get; set; } // Diện tích (ha)

    [MaxLength(100)]
    public string? Coordinates { get; set; } // Tọa độ GPS

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("UserID")]
    public virtual User? User { get; set; }

    public virtual ICollection<DurianTree> Trees { get; set; } = new List<DurianTree>();
}

/// <summary>
/// Cây sầu riêng
/// </summary>
public class DurianTree
{
    [Key]
    public int TreeID { get; set; }

    [Required]
    public int FarmID { get; set; }

    [Required]
    [MaxLength(50)]
    public string TreeCode { get; set; } = string.Empty; // Mã định danh cây

    [MaxLength(50)]
    public string? Variety { get; set; } // Giống: Musang King, Monthong, Ri6...

    public int? PlantingYear { get; set; } // Năm trồng

    [MaxLength(20)]
    public string Status { get; set; } = "Active"; // Active, Inactive, Removed

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("FarmID")]
    public virtual Farm? Farm { get; set; }

    public virtual ICollection<HarvestRequest> HarvestRequests { get; set; } = new List<HarvestRequest>();
    public virtual ICollection<FarmingLog> FarmingLogs { get; set; } = new List<FarmingLog>();
}

/// <summary>
/// Kho / Hợp tác xã
/// </summary>
public class Warehouse
{
    [Key]
    public int WarehouseID { get; set; }

    [Required]
    [MaxLength(100)]
    public string WarehouseName { get; set; } = string.Empty;

    [MaxLength(255)]
    public string? Location { get; set; }

    [MaxLength(100)]
    public string? Coordinates { get; set; }

    public int? ManagerID { get; set; } // Thủ kho

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("ManagerID")]
    public virtual User? Manager { get; set; }

    public virtual ICollection<ProductBatch> ProductBatches { get; set; } = new List<ProductBatch>();
}

/// <summary>
/// Yêu cầu thu hoạch (Bước 1: Nông dân xin cắt)
/// </summary>
public class HarvestRequest
{
    [Key]
    public int RequestID { get; set; }

    [Required]
    public int TreeID { get; set; }

    [Required]
    public int UserID { get; set; } // Nông dân tạo yêu cầu

    [Required]
    [MaxLength(50)]
    public string RequestCode { get; set; } = string.Empty; // VD: REQ-20260131-001

    public DateTime RequestDate { get; set; } = DateTime.UtcNow; // Ngày tạo yêu cầu

    public DateTime ExpectedHarvestDate { get; set; } // Ngày dự kiến cắt

    [Column(TypeName = "decimal(10,2)")]
    public decimal EstimatedQuantity { get; set; } // Số kg ước tính

    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected, CheckedIn, Completed, Cancelled

    [MaxLength(500)]
    public string? ApprovalNote { get; set; } // Lý do từ chối hoặc ghi chú

    [MaxLength(1000)]
    public string? PHICheckResult { get; set; } // Kết quả check PHI (JSON)

    public DateTime? SafeAfterDate { get; set; } // Ngày an toàn sớm nhất

    public DateTime? ApprovedAt { get; set; }

    public int? ApprovedBy { get; set; } // UserID của người duyệt (null = tự động)

    public DateTime? CheckedInAt { get; set; } // Thời điểm nhập kho

    public int? CheckedInBy { get; set; } // Thủ kho xác nhận

    [Column(TypeName = "decimal(10,2)")]
    public decimal? ActualQuantity { get; set; } // Số kg thực tế sau khi cân

    [Column(TypeName = "decimal(10,2)")]
    public decimal? GradeA_Quantity { get; set; } // Loại A (xuất khẩu)

    [Column(TypeName = "decimal(10,2)")]
    public decimal? GradeB_Quantity { get; set; } // Loại B (kem/chế biến)

    [Column(TypeName = "decimal(10,2)")]
    public decimal? GradeC_Quantity { get; set; } // Loại C (dạt)

    public DateTime? CompletedAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("TreeID")]
    public virtual DurianTree? Tree { get; set; }

    [ForeignKey("UserID")]
    public virtual User? Farmer { get; set; }

    public virtual ICollection<BatchHarvestRequest> BatchRequests { get; set; } = new List<BatchHarvestRequest>();
}

/// <summary>
/// Lô sản phẩm xuất khẩu (có thể gộp nhiều HarvestRequest)
/// </summary>
public class ProductBatch
{
    [Key]
    public int BatchID { get; set; }

    public int? WarehouseID { get; set; }

    [Required]
    [MaxLength(50)]
    public string BatchCode { get; set; } = string.Empty; // Mã lô hàng: BATCH-20260131-001

    [MaxLength(20)]
    public string BatchType { get; set; } = "Mixed"; // Single (1 nông dân) / Mixed (gộp nhiều nông dân)

    [Column(TypeName = "decimal(10,2)")]
    public decimal? TotalWeight { get; set; } // Tổng trọng lượng

    [Column(TypeName = "decimal(10,2)")]
    public decimal? GradeA_Weight { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal? GradeB_Weight { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal? GradeC_Weight { get; set; }

    [MaxLength(50)]
    public string? QualityGrade { get; set; } // Phân loại chung: Premium, Standard, Economy

    [MaxLength(100)]
    public string? TargetMarket { get; set; } // Thị trường: China, Japan, Domestic...

    public DateTime? PackingDate { get; set; } // Ngày đóng gói

    [MaxLength(20)]
    public string ExportStatus { get; set; } = "InWarehouse"; // InWarehouse, Packed, Shipped, Delivered

    public bool IsSafe { get; set; } = true; // Đạt an toàn VSTP

    [MaxLength(500)]
    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int? CreatedBy { get; set; } // Thủ kho tạo lô

    // Navigation properties
    [ForeignKey("WarehouseID")]
    public virtual Warehouse? Warehouse { get; set; }

    public virtual ICollection<BatchHarvestRequest> HarvestRequests { get; set; } = new List<BatchHarvestRequest>();
    public virtual ICollection<BatchQRCode> QRCodes { get; set; } = new List<BatchQRCode>();
}

/// <summary>
/// Bảng trung gian: Lô sản phẩm - Yêu cầu thu hoạch (M-N)
/// </summary>
public class BatchHarvestRequest
{
    [Key]
    public int ID { get; set; }

    [Required]
    public int BatchID { get; set; }

    [Required]
    public int RequestID { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal? ContributedWeight { get; set; } // Trọng lượng đóng góp từ request này

    public DateTime AddedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("BatchID")]
    public virtual ProductBatch? Batch { get; set; }

    [ForeignKey("RequestID")]
    public virtual HarvestRequest? HarvestRequest { get; set; }
}

/// <summary>
/// Nhật ký nông vụ / Hoạt động canh tác
/// </summary>
public class FarmingLog
{
    [Key]
    public int LogID { get; set; }

    [Required]
    public int TreeID { get; set; } // Liên kết với cây thay vì batch

    [Required]
    public DateTime LogDate { get; set; } = DateTime.UtcNow;

    [Required]
    [MaxLength(50)]
    public string ActivityType { get; set; } = string.Empty; // Spraying, Fertilizing, Watering, Pruning...

    [MaxLength(500)]
    public string? Description { get; set; }

    [MaxLength(100)]
    public string? ChemicalUsed { get; set; } // Tên thuốc/phân bón

    public int? ChemicalID { get; set; } // Liên kết với bảng Chemical

    [Column(TypeName = "decimal(10,2)")]
    public decimal? DosageAmount { get; set; } // Liều lượng

    [MaxLength(20)]
    public string? Unit { get; set; } // ml, g, kg, l

    public int? SafetyDays { get; set; } // Số ngày cách ly (PHI)

    public DateTime? SafeAfterDate { get; set; } // Ngày an toàn sau khi phun

    [MaxLength(255)]
    public string? ImagePath { get; set; } // Ảnh chụp hoạt động

    public bool IsAutoValidated { get; set; } = false; // Đã kiểm tra tự động

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("TreeID")]
    public virtual DurianTree? Tree { get; set; }

    [ForeignKey("ChemicalID")]
    public virtual Chemical? Chemical { get; set; }
}

/// <summary>
/// Danh mục hóa chất / Thuốc BVTV
/// </summary>
public class Chemical
{
    [Key]
    public int ChemicalID { get; set; }

    [Required]
    [MaxLength(100)]
    public string ChemicalName { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? ActiveIngredient { get; set; } // Hoạt chất

    public int PHI_Days { get; set; } = 14; // Pre-Harvest Interval (ngày cách ly)

    public bool IsBanned { get; set; } = false; // Bị cấm sử dụng

    [MaxLength(100)]
    public string? TargetMarket { get; set; } // Thị trường áp dụng: VN, CN, EU...

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public virtual ICollection<FarmingLog> FarmingLogs { get; set; } = new List<FarmingLog>();
}

/// <summary>
/// Mã QR cho lô hàng
/// </summary>
public class BatchQRCode
{
    [Key]
    public int QRID { get; set; }

    [Required]
    public int BatchID { get; set; }

    [Required]
    [MaxLength(500)]
    public string QRCodeData { get; set; } = string.Empty; // Nội dung encode trong QR

    [MaxLength(255)]
    public string? QRImagePath { get; set; } // Đường dẫn ảnh QR

    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;

    public int ScanCount { get; set; } = 0; // Số lần quét

    public bool IsActive { get; set; } = true;

    // Navigation property
    [ForeignKey("BatchID")]
    public virtual ProductBatch? Batch { get; set; }
}
