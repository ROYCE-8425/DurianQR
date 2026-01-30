using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DurianQR.API.Data;

namespace DurianQR.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TraceController : ControllerBase
{
    private readonly DurianQRContext _context;

    public TraceController(DurianQRContext context)
    {
        _context = context;
    }

    // GET: api/trace/{batchCode} - Public traceability endpoint
    [HttpGet("{batchCode}")]
    public async Task<IActionResult> GetTraceability(string batchCode)
    {
        var batch = await _context.HarvestBatches
            .Include(b => b.Tree)
                .ThenInclude(t => t!.Farm)
                    .ThenInclude(f => f!.User)
            .Include(b => b.FarmingLogs.OrderBy(l => l.LogDate))
            .Include(b => b.QRCodes)
            .FirstOrDefaultAsync(b => b.BatchCode == batchCode);

        if (batch == null)
        {
            return NotFound(new { message = "Lô hàng không tồn tại", batchCode });
        }

        // Record scan
        var qrCode = batch.QRCodes.FirstOrDefault();
        if (qrCode != null)
        {
            qrCode.ScanCount++;
            await _context.SaveChangesAsync();
        }

        // Build traceability response
        var response = new
        {
            // Thông tin lô hàng
            batch = new
            {
                batchCode = batch.BatchCode,
                status = batch.Status,
                isSafe = batch.IsSafe,
                safetyLabel = batch.IsSafe ? "✅ ĐẠT AN TOÀN VSTP" : "⚠️ CHƯA ĐẠT AN TOÀN",
                floweringDate = batch.FloweringDate,
                harvestDate = batch.ActualHarvest,
                quantity = batch.Quantity,
                qualityGrade = batch.QualityGrade
            },

            // Thông tin cây
            tree = batch.Tree != null ? new
            {
                treeCode = batch.Tree.TreeCode,
                variety = batch.Tree.Variety,
                plantingYear = batch.Tree.PlantingYear
            } : null,

            // Thông tin nông trại
            farm = batch.Tree?.Farm != null ? new
            {
                farmName = batch.Tree.Farm.FarmName,
                location = batch.Tree.Farm.Location,
                area = batch.Tree.Farm.Area,
                coordinates = batch.Tree.Farm.Coordinates
            } : null,

            // Thông tin nông dân
            farmer = batch.Tree?.Farm?.User != null ? new
            {
                fullName = batch.Tree.Farm.User.FullName,
                phone = batch.Tree.Farm.User.Phone
            } : null,

            // Nhật ký nông vụ (timeline)
            farmingHistory = batch.FarmingLogs.Select(log => new
            {
                date = log.LogDate,
                activity = log.ActivityType,
                description = log.Description,
                chemical = log.ChemicalUsed,
                dosage = log.DosageAmount.HasValue ? $"{log.DosageAmount} {log.Unit}" : null,
                safetyDays = log.SafetyDays,
                safeAfterDate = log.SafeAfterDate,
                verified = log.IsAutoValidated
            }),

            // Thống kê QR
            qrStats = new
            {
                scanCount = qrCode?.ScanCount ?? 0,
                generatedAt = qrCode?.GeneratedAt
            },

            // Timestamp
            queriedAt = DateTime.UtcNow
        };

        return Ok(response);
    }

    // GET: api/trace/verify/{batchCode} - Quick verify endpoint
    [HttpGet("verify/{batchCode}")]
    public async Task<IActionResult> VerifyBatch(string batchCode)
    {
        var batch = await _context.HarvestBatches
            .Include(b => b.FarmingLogs)
            .FirstOrDefaultAsync(b => b.BatchCode == batchCode);

        if (batch == null)
        {
            return NotFound(new 
            { 
                valid = false, 
                message = "Mã lô hàng không hợp lệ" 
            });
        }

        // Check if harvested
        var isHarvested = batch.Status == "Harvested" || batch.Status == "Exported";

        // Check latest unsafe log
        var latestUnsafeLog = batch.FarmingLogs
            .Where(l => l.SafeAfterDate.HasValue && l.SafeAfterDate.Value > DateTime.UtcNow)
            .OrderByDescending(l => l.SafeAfterDate)
            .FirstOrDefault();

        return Ok(new
        {
            valid = true,
            batchCode = batch.BatchCode,
            isSafe = batch.IsSafe,
            status = batch.Status,
            harvestDate = batch.ActualHarvest,
            safetyStatus = batch.IsSafe 
                ? "✅ Lô hàng ĐẠT tiêu chuẩn an toàn VSTP" 
                : latestUnsafeLog != null 
                    ? $"⚠️ Lô hàng sẽ an toàn sau: {latestUnsafeLog.SafeAfterDate:dd/MM/yyyy}"
                    : "⚠️ Lô hàng CHƯA ĐẠT tiêu chuẩn"
        });
    }
}
