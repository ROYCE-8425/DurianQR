using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DurianQR.API.Data;
using DurianQR.API.Models;

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
        var batch = await _context.ProductBatches
            .Include(b => b.Warehouse)
            .Include(b => b.HarvestRequests)
                .ThenInclude(hr => hr.HarvestRequest)
                    .ThenInclude(r => r!.Farmer)
            .Include(b => b.HarvestRequests)
                .ThenInclude(hr => hr.HarvestRequest)
                    .ThenInclude(r => r!.Tree)
                        .ThenInclude(t => t!.Farm)
                            .ThenInclude(f => f!.User)
            .Include(b => b.HarvestRequests)
                .ThenInclude(hr => hr.HarvestRequest)
                    .ThenInclude(r => r!.Tree)
                        .ThenInclude(t => t!.FarmingLogs.OrderByDescending(l => l.LogDate))
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

        // Get all farmers contributing to this batch
        var harvestRequests = batch.HarvestRequests
            .Select(hr => hr.HarvestRequest)
            .Where(r => r != null)
            .ToList();

        var farmers = harvestRequests
            .Select(r => r!.Farmer)
            .Where(f => f != null)
            .DistinctBy(f => f!.UserID)
            .Select(f => new
            {
                fullName = f!.FullName,
                phone = f.Phone
            })
            .ToList();

        var farms = harvestRequests
            .Select(r => r!.Tree?.Farm)
            .Where(f => f != null)
            .DistinctBy(f => f!.FarmID)
            .Select(f => new
            {
                farmName = f!.FarmName,
                location = f.Location,
                area = f.Area,
                coordinates = f.Coordinates
            })
            .ToList();

        var trees = harvestRequests
            .Select(r => r!.Tree)
            .Where(t => t != null)
            .DistinctBy(t => t!.TreeID)
            .Select(t => new
            {
                treeCode = t!.TreeCode,
                variety = t.Variety,
                plantingYear = t.PlantingYear
            })
            .ToList();

        // Get all farming logs from all trees
        var farmingLogs = harvestRequests
            .Where(r => r?.Tree?.FarmingLogs != null)
            .SelectMany(r => r!.Tree!.FarmingLogs)
            .OrderByDescending(l => l.LogDate)
            .Take(20) // Limit to last 20 activities
            .Select(log => new
            {
                date = log.LogDate,
                activity = log.ActivityType,
                description = log.Description,
                chemical = log.ChemicalUsed,
                dosage = log.DosageAmount.HasValue ? $"{log.DosageAmount} {log.Unit}" : null,
                safetyDays = log.SafetyDays,
                safeAfterDate = log.SafeAfterDate,
                verified = log.IsAutoValidated
            })
            .ToList();

        // Build traceability response
        var response = new
        {
            // Thông tin lô hàng
            batch = new
            {
                batchCode = batch.BatchCode,
                batchType = batch.BatchType,
                status = batch.ExportStatus,
                isSafe = batch.IsSafe,
                safetyLabel = batch.IsSafe ? "✅ ĐẠT AN TOÀN VSTP" : "⚠️ CHƯA ĐẠT AN TOÀN",
                packingDate = batch.PackingDate,
                totalWeight = batch.TotalWeight,
                gradeA = batch.GradeA_Weight,
                gradeB = batch.GradeB_Weight,
                gradeC = batch.GradeC_Weight,
                qualityGrade = batch.QualityGrade,
                targetMarket = batch.TargetMarket,
                warehouse = batch.Warehouse?.WarehouseName 
            },

            // Số lượng nguồn
            sources = new
            {
                farmersCount = farmers.Count,
                farmsCount = farms.Count,
                treesCount = trees.Count,
                requestsCount = harvestRequests.Count
            },

            // Thông tin cây (tất cả các cây đóng góp)
            trees = trees,

            // Thông tin nông trại
            farms = farms,

            // Thông tin nông dân
            farmers = farmers,

            // Nhật ký nông vụ (timeline)
            farmingHistory = farmingLogs,

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
        var batch = await _context.ProductBatches
            .FirstOrDefaultAsync(b => b.BatchCode == batchCode);

        if (batch == null)
        {
            return NotFound(new 
            { 
                valid = false, 
                message = "Mã lô hàng không hợp lệ" 
            });
        }

        return Ok(new
        {
            valid = true,
            batchCode = batch.BatchCode,
            isSafe = batch.IsSafe,
            status = batch.ExportStatus,
            packingDate = batch.PackingDate,
            totalWeight = batch.TotalWeight,
            safetyStatus = batch.IsSafe 
                ? "✅ Lô hàng ĐẠT tiêu chuẩn an toàn VSTP" 
                : "⚠️ Lô hàng CHƯA ĐẠT tiêu chuẩn"
        });
    }
}
