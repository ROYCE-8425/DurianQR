using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DurianQR.API.Models;

/// <summary>
/// Người dùng hệ thống (Nông dân, Admin, Khách)
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
    public string Role { get; set; } = "Farmer"; // Farmer, Admin, Viewer

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public virtual ICollection<Farm> Farms { get; set; } = new List<Farm>();
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

    public virtual ICollection<HarvestBatch> Batches { get; set; } = new List<HarvestBatch>();
}

/// <summary>
/// Lô thu hoạch
/// </summary>
public class HarvestBatch
{
    [Key]
    public int BatchID { get; set; }

    [Required]
    public int TreeID { get; set; }

    [Required]
    [MaxLength(50)]
    public string BatchCode { get; set; } = string.Empty; // Mã lô hàng

    public DateTime? FloweringDate { get; set; } // Ngày ra hoa

    public DateTime? ExpectedHarvest { get; set; } // Ngày dự kiến thu hoạch

    public DateTime? ActualHarvest { get; set; } // Ngày thu hoạch thực tế

    [Column(TypeName = "decimal(10,2)")]
    public decimal? Quantity { get; set; } // Số lượng (kg)

    [MaxLength(10)]
    public string? QualityGrade { get; set; } // Loại: A, B, C

    public bool IsSafe { get; set; } = true; // Đạt an toàn VSTP

    [MaxLength(20)]
    public string Status { get; set; } = "Growing"; // Growing, Ready, Harvested, Exported

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("TreeID")]
    public virtual DurianTree? Tree { get; set; }

    public virtual ICollection<FarmingLog> FarmingLogs { get; set; } = new List<FarmingLog>();
    public virtual ICollection<BatchQRCode> QRCodes { get; set; } = new List<BatchQRCode>();
}

/// <summary>
/// Nhật ký nông vụ / Hoạt động canh tác
/// </summary>
public class FarmingLog
{
    [Key]
    public int LogID { get; set; }

    [Required]
    public int BatchID { get; set; }

    [Required]
    public DateTime LogDate { get; set; } = DateTime.UtcNow;

    [Required]
    [MaxLength(50)]
    public string ActivityType { get; set; } = string.Empty; // Spraying, Fertilizing, Watering, Pruning...

    [MaxLength(500)]
    public string? Description { get; set; }

    [MaxLength(100)]
    public string? ChemicalUsed { get; set; } // Tên thuốc/phân bón

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

    // Navigation property
    [ForeignKey("BatchID")]
    public virtual HarvestBatch? Batch { get; set; }
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
    public virtual HarvestBatch? Batch { get; set; }
}

