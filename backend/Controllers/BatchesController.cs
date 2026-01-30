using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DurianQR.API.Data;
using DurianQR.API.Models;

namespace DurianQR.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BatchesController : ControllerBase
{
    private readonly DurianQRContext _context;

    public BatchesController(DurianQRContext context)
    {
        _context = context;
    }

    // GET: api/batches - Lấy tất cả lô sản phẩm
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductBatch>>> GetBatches()
    {
        return await _context.ProductBatches
            .Include(b => b.Warehouse)
            .Include(b => b.HarvestRequests)
                .ThenInclude(hr => hr.HarvestRequest)
                    .ThenInclude(r => r!.Tree)
                        .ThenInclude(t => t!.Farm)
            .Include(b => b.QRCodes)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();
    }

    // GET: api/batches/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ProductBatch>> GetBatch(int id)
    {
        var batch = await _context.ProductBatches
            .Include(b => b.Warehouse)
            .Include(b => b.HarvestRequests)
                .ThenInclude(hr => hr.HarvestRequest)
                    .ThenInclude(r => r!.Tree)
                        .ThenInclude(t => t!.Farm)
                            .ThenInclude(f => f!.User)
            .Include(b => b.QRCodes)
            .FirstOrDefaultAsync(b => b.BatchID == id);

        if (batch == null)
        {
            return NotFound(new { message = "Batch not found" });
        }

        return batch;
    }

    // GET: api/batches/code/{batchCode}
    [HttpGet("code/{batchCode}")]
    public async Task<ActionResult<ProductBatch>> GetBatchByCode(string batchCode)
    {
        var batch = await _context.ProductBatches
            .Include(b => b.Warehouse)
            .Include(b => b.HarvestRequests)
                .ThenInclude(hr => hr.HarvestRequest)
                    .ThenInclude(r => r!.Farmer)
            .Include(b => b.QRCodes)
            .FirstOrDefaultAsync(b => b.BatchCode == batchCode);

        if (batch == null)
        {
            return NotFound(new { message = "Batch not found" });
        }

        return batch;
    }

    // POST: api/batches/create - Tạo lô sản phẩm từ nhiều HarvestRequests (Bước 4)
    [HttpPost("create")]
    public async Task<ActionResult<ProductBatch>> CreateBatch([FromBody] CreateBatchRequest request)
    {
        // Validate request IDs
        var harvestRequests = await _context.HarvestRequests
            .Where(r => request.HarvestRequestIds.Contains(r.RequestID))
            .Where(r => r.Status == "Completed") // Chỉ lấy những request đã hoàn thành nhập kho
            .Include(r => r.Tree)
            .ToListAsync();

        if (!harvestRequests.Any())
        {
            return BadRequest(new { message = "Không có yêu cầu thu hoạch hợp lệ để tạo lô" });
        }

        // Generate batch code
        var batchCode = $"BATCH-{DateTime.Now:yyyyMMdd}-{Guid.NewGuid().ToString()[..6].ToUpper()}";

        // Create batch
        var batch = new ProductBatch
        {
            BatchCode = batchCode,
            WarehouseID = request.WarehouseId,
            BatchType = harvestRequests.Count > 1 ? "Mixed" : "Single",
            TotalWeight = harvestRequests.Sum(r => r.ActualQuantity ?? 0),
            GradeA_Weight = harvestRequests.Sum(r => r.GradeA_Quantity ?? 0),
            GradeB_Weight = harvestRequests.Sum(r => r.GradeB_Quantity ?? 0),
            GradeC_Weight = harvestRequests.Sum(r => r.GradeC_Quantity ?? 0),
            QualityGrade = request.QualityGrade,
            TargetMarket = request.TargetMarket,
            PackingDate = DateTime.UtcNow,
            ExportStatus = "Packed",
            IsSafe = true, // Đã kiểm tra PHI trước đó
            Notes = request.Notes,
            CreatedBy = request.CreatedBy,
            CreatedAt = DateTime.UtcNow
        };

        _context.ProductBatches.Add(batch);
        await _context.SaveChangesAsync();

        // Link harvest requests to batch
        foreach (var hr in harvestRequests)
        {
            var link = new BatchHarvestRequest
            {
                BatchID = batch.BatchID,
                RequestID = hr.RequestID,
                ContributedWeight = hr.ActualQuantity,
                AddedAt = DateTime.UtcNow
            };
            _context.BatchHarvestRequests.Add(link);
        }

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetBatch), new { id = batch.BatchID }, new
        {
            batch,
            message = $"Đã tạo lô {batchCode} từ {harvestRequests.Count} yêu cầu thu hoạch"
        });
    }

    // PUT: api/batches/5/status - Cập nhật trạng thái xuất khẩu
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateBatchStatus(int id, [FromBody] UpdateStatusRequest request)
    {
        var batch = await _context.ProductBatches.FindAsync(id);

        if (batch == null)
        {
            return NotFound(new { message = "Batch not found" });
        }

        batch.ExportStatus = request.Status;
        await _context.SaveChangesAsync();

        return Ok(new { message = $"Đã cập nhật trạng thái lô {batch.BatchCode} thành {request.Status}" });
    }

    // DELETE: api/batches/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBatch(int id)
    {
        var batch = await _context.ProductBatches.FindAsync(id);
        if (batch == null)
        {
            return NotFound(new { message = "Batch not found" });
        }

        _context.ProductBatches.Remove(batch);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

// DTOs
public class CreateBatchRequest
{
    public List<int> HarvestRequestIds { get; set; } = new();
    public int? WarehouseId { get; set; }
    public string? QualityGrade { get; set; }
    public string? TargetMarket { get; set; }
    public string? Notes { get; set; }
    public int? CreatedBy { get; set; }
}

public class UpdateStatusRequest
{
    public string Status { get; set; } = string.Empty;
}
