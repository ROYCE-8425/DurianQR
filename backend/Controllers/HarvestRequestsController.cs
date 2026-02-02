using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DurianQR.API.Data;
using DurianQR.API.Models;
using System.Text.Json;

namespace DurianQR.API.Controllers;

/// <summary>
/// Controller xử lý Bước 1 & 2 & 3: Yêu cầu thu hoạch → Check PHI → Nhập kho
/// </summary>
[ApiController]
[Route("api/harvest-requests")]
public class HarvestRequestsController : ControllerBase
{
    private readonly DurianQRContext _context;

    public HarvestRequestsController(DurianQRContext context)
    {
        _context = context;
    }

    // ==================== BƯỚC 1: NÔNG DÂN TẠO YÊU CẦU ====================

    // GET: api/harvest-requests/check-phi/{treeId} - Kiểm tra PHI trước khi tạo yêu cầu
    [HttpGet("check-phi/{treeId}")]
    public async Task<IActionResult> CheckPHI(int treeId, [FromQuery] DateTime? harvestDate = null)
    {
        var tree = await _context.DurianTrees
            .Include(t => t.FarmingLogs.OrderByDescending(l => l.LogDate))
                .ThenInclude(l => l.Chemical)
            .FirstOrDefaultAsync(t => t.TreeID == treeId);

        if (tree == null)
        {
            return NotFound(new { message = "Không tìm thấy cây" });
        }

        var checkDate = harvestDate ?? DateTime.UtcNow;

        // Tìm lần phun thuốc cuối cùng
        var latestSpray = tree.FarmingLogs
            .Where(l => l.ActivityType == "Spraying" && l.SafeAfterDate.HasValue)
            .OrderByDescending(l => l.LogDate)
            .FirstOrDefault();

        if (latestSpray == null)
        {
            return Ok(new
            {
                canHarvest = true,
                message = "✅ Cây chưa có lịch sử phun thuốc. Có thể thu hoạch.",
                safeAfterDate = (DateTime?)null,
                daysRemaining = 0
            });
        }

        var safeAfterDate = latestSpray.SafeAfterDate!.Value;
        var canHarvest = checkDate >= safeAfterDate;
        var daysRemaining = canHarvest ? 0 : (int)Math.Ceiling((safeAfterDate - checkDate).TotalDays);

        return Ok(new
        {
            canHarvest,
            message = canHarvest 
                ? "✅ Đủ điều kiện thu hoạch. Đã qua thời gian cách ly."
                : $"❌ Chưa an toàn. Còn {daysRemaining} ngày mới hết thời gian cách ly.",
            safeAfterDate,
            daysRemaining,
            lastSpray = new
            {
                date = latestSpray.LogDate,
                chemical = latestSpray.ChemicalUsed,
                phiDays = latestSpray.SafetyDays
            }
        });
    }

    // POST: api/harvest-requests - Nông dân tạo yêu cầu thu hoạch
    [HttpPost]
    public async Task<ActionResult<HarvestRequest>> CreateRequest([FromBody] CreateHarvestRequestDTO dto)
    {
        // Validate tree
        var tree = await _context.DurianTrees
            .Include(t => t.FarmingLogs)
            .Include(t => t.Farm)
            .FirstOrDefaultAsync(t => t.TreeID == dto.TreeId);

        if (tree == null)
        {
            return NotFound(new { message = "Không tìm thấy cây" });
        }

        // Check PHI
        var latestSpray = tree.FarmingLogs
            .Where(l => l.ActivityType == "Spraying" && l.SafeAfterDate.HasValue)
            .OrderByDescending(l => l.LogDate)
            .FirstOrDefault();

        DateTime? safeAfterDate = latestSpray?.SafeAfterDate;
        bool canHarvest = !safeAfterDate.HasValue || dto.ExpectedHarvestDate >= safeAfterDate.Value;

        // Generate request code
        var requestCode = $"REQ-{DateTime.Now:yyyyMMdd}-{Guid.NewGuid().ToString()[..6].ToUpper()}";

        var request = new HarvestRequest
        {
            TreeID = dto.TreeId,
            UserID = dto.UserId,
            RequestCode = requestCode,
            RequestDate = DateTime.UtcNow,
            ExpectedHarvestDate = dto.ExpectedHarvestDate,
            EstimatedQuantity = dto.EstimatedQuantity,
            SafeAfterDate = safeAfterDate,
            PHICheckResult = JsonSerializer.Serialize(new
            {
                checked_at = DateTime.UtcNow,
                canHarvest,
                safeAfterDate,
                lastSpray = latestSpray != null ? new
                {
                    date = latestSpray.LogDate,
                    chemical = latestSpray.ChemicalUsed,
                    phiDays = latestSpray.SafetyDays
                } : null
            }),
            // TỰ ĐỘNG DUYỆT nếu qua PHI
            Status = canHarvest ? "Approved" : "Rejected",
            ApprovalNote = canHarvest 
                ? "Tự động duyệt - Đã qua thời gian cách ly"
                : $"Tự động từ chối - Chưa qua thời gian cách ly. Vui lòng đợi đến ngày {safeAfterDate:dd/MM/yyyy}",
            ApprovedAt = canHarvest ? DateTime.UtcNow : null,
            CreatedAt = DateTime.UtcNow
        };

        _context.HarvestRequests.Add(request);
        await _context.SaveChangesAsync();

        if (canHarvest)
        {
            return CreatedAtAction(nameof(GetRequest), new { id = request.RequestID }, new
            {
                success = true,
                message = $"✅ Yêu cầu được duyệt! Mã phiếu thu hoạch: {requestCode}",
                request
            });
        }
        else
        {
            return BadRequest(new
            {
                success = false,
                message = $"❌ Chưa đủ điều kiện thu hoạch. Vui lòng đợi đến ngày {safeAfterDate:dd/MM/yyyy}",
                request
            });
        }
    }

    // GET: api/harvest-requests/my?userId=5 - Lấy danh sách yêu cầu của nông dân
    [HttpGet("my")]
    public async Task<ActionResult<IEnumerable<HarvestRequest>>> GetMyRequests([FromQuery] int userId)
    {
        return await _context.HarvestRequests
            .Where(r => r.UserID == userId)
            .Include(r => r.Tree)
                .ThenInclude(t => t!.Farm)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    // GET: api/harvest-requests/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<HarvestRequest>> GetRequest(int id)
    {
        var request = await _context.HarvestRequests
            .Include(r => r.Tree)
                .ThenInclude(t => t!.Farm)
            .Include(r => r.Farmer)
            .FirstOrDefaultAsync(r => r.RequestID == id);

        if (request == null)
        {
            return NotFound(new { message = "Không tìm thấy yêu cầu" });
        }

        return request;
    }

    // ==================== BƯỚC 2 & 3: THỦ KHO CHECK-IN & NHẬP KHO ====================

    // GET: api/harvest-requests/pending - DS yêu cầu đã duyệt, chờ nhập kho
    [HttpGet("pending")]
    public async Task<ActionResult<IEnumerable<HarvestRequest>>> GetPendingRequests()
    {
        return await _context.HarvestRequests
            .Where(r => r.Status == "Approved")
            .Include(r => r.Tree)
                .ThenInclude(t => t!.Farm)
            .Include(r => r.Farmer)
            .OrderBy(r => r.ExpectedHarvestDate)
            .ToListAsync();
    }

    // PUT: api/harvest-requests/{id}/checkin - Thủ kho xác nhận nhận hàng
    [HttpPut("{id}/checkin")]
    public async Task<IActionResult> CheckIn(int id, [FromBody] CheckInDTO dto)
    {
        var request = await _context.HarvestRequests.FindAsync(id);

        if (request == null)
        {
            return NotFound(new { message = "Không tìm thấy yêu cầu" });
        }

        if (request.Status != "Approved")
        {
            return BadRequest(new { message = $"Yêu cầu không ở trạng thái chờ nhập kho. Trạng thái hiện tại: {request.Status}" });
        }

        request.Status = "CheckedIn";
        request.CheckedInAt = DateTime.UtcNow;
        request.CheckedInBy = dto.TraderId;
        request.ActualQuantity = dto.ActualQuantity;
        request.GradeA_Quantity = dto.GradeA;
        request.GradeB_Quantity = dto.GradeB;
        request.GradeC_Quantity = dto.GradeC;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = $"✅ Đã nhận hàng. Tổng: {dto.ActualQuantity}kg (A: {dto.GradeA}kg, B: {dto.GradeB}kg, C: {dto.GradeC}kg)",
            request
        });
    }

    // PUT: api/harvest-requests/{id}/complete - Hoàn thành nhập kho
    [HttpPut("{id}/complete")]
    public async Task<IActionResult> Complete(int id)
    {
        var request = await _context.HarvestRequests.FindAsync(id);

        if (request == null)
        {
            return NotFound(new { message = "Không tìm thấy yêu cầu" });
        }

        if (request.Status != "CheckedIn")
        {
            return BadRequest(new { message = "Yêu cầu chưa được check-in" });
        }

        request.Status = "Completed";
        request.CompletedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new { message = "✅ Hoàn thành nhập kho", request });
    }

    // GET: api/harvest-requests/completed - DS yêu cầu đã hoàn thành, chờ đóng lô
    [HttpGet("completed")]
    public async Task<ActionResult<IEnumerable<HarvestRequest>>> GetCompletedRequests()
    {
        return await _context.HarvestRequests
            .Where(r => r.Status == "Completed")
            .Where(r => !r.BatchRequests.Any()) // Chưa được gán vào lô nào
            .Include(r => r.Tree)
                .ThenInclude(t => t!.Farm)
            .Include(r => r.Farmer)
            .OrderBy(r => r.CompletedAt)
            .ToListAsync();
    }
}

// DTOs
public class CreateHarvestRequestDTO
{
    public int TreeId { get; set; }
    public int UserId { get; set; }
    public DateTime ExpectedHarvestDate { get; set; }
    public decimal EstimatedQuantity { get; set; }
}

public class CheckInDTO
{
    public int TraderId { get; set; }
    public decimal ActualQuantity { get; set; }
    public decimal GradeA { get; set; }
    public decimal GradeB { get; set; }
    public decimal GradeC { get; set; }
}
