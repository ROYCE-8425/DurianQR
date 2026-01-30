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

    // GET: api/batches
    [HttpGet]
    public async Task<ActionResult<IEnumerable<HarvestBatch>>> GetBatches()
    {
        return await _context.HarvestBatches
            .Include(b => b.Tree)
                .ThenInclude(t => t!.Farm)
            .Include(b => b.FarmingLogs)
            .ToListAsync();
    }

    // GET: api/batches/5
    [HttpGet("{id}")]
    public async Task<ActionResult<HarvestBatch>> GetBatch(int id)
    {
        var batch = await _context.HarvestBatches
            .Include(b => b.Tree)
                .ThenInclude(t => t!.Farm)
            .Include(b => b.FarmingLogs)
            .Include(b => b.QRCodes)
            .FirstOrDefaultAsync(b => b.BatchID == id);

        if (batch == null)
        {
            return NotFound(new { message = "Batch not found" });
        }

        return batch;
    }

    // GET: api/batches/code/{batchCode} - Get by batch code
    [HttpGet("code/{batchCode}")]
    public async Task<ActionResult<HarvestBatch>> GetBatchByCode(string batchCode)
    {
        var batch = await _context.HarvestBatches
            .Include(b => b.Tree)
                .ThenInclude(t => t!.Farm)
                    .ThenInclude(f => f!.User)
            .Include(b => b.FarmingLogs)
            .FirstOrDefaultAsync(b => b.BatchCode == batchCode);

        if (batch == null)
        {
            return NotFound(new { message = "Batch not found" });
        }

        return batch;
    }

    // GET: api/batches/tree/5 - Get batches by tree
    [HttpGet("tree/{treeId}")]
    public async Task<ActionResult<IEnumerable<HarvestBatch>>> GetBatchesByTree(int treeId)
    {
        return await _context.HarvestBatches
            .Where(b => b.TreeID == treeId)
            .Include(b => b.FarmingLogs)
            .ToListAsync();
    }

    // POST: api/batches
    [HttpPost]
    public async Task<ActionResult<HarvestBatch>> CreateBatch(HarvestBatch batch)
    {
        // Generate unique batch code if not provided
        if (string.IsNullOrEmpty(batch.BatchCode))
        {
            batch.BatchCode = $"DQR-{DateTime.Now:yyyyMMdd}-{Guid.NewGuid().ToString()[..8].ToUpper()}";
        }

        batch.CreatedAt = DateTime.UtcNow;
        _context.HarvestBatches.Add(batch);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetBatch), new { id = batch.BatchID }, batch);
    }

    // PUT: api/batches/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBatch(int id, HarvestBatch batch)
    {
        if (id != batch.BatchID)
        {
            return BadRequest(new { message = "ID mismatch" });
        }

        _context.Entry(batch).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await _context.HarvestBatches.AnyAsync(b => b.BatchID == id))
            {
                return NotFound(new { message = "Batch not found" });
            }
            throw;
        }

        return NoContent();
    }

    // DELETE: api/batches/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBatch(int id)
    {
        var batch = await _context.HarvestBatches.FindAsync(id);
        if (batch == null)
        {
            return NotFound(new { message = "Batch not found" });
        }

        _context.HarvestBatches.Remove(batch);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // PUT: api/batches/5/harvest - Mark batch as harvested
    [HttpPut("{id}/harvest")]
    public async Task<IActionResult> HarvestBatch(int id, [FromBody] HarvestRequest request)
    {
        var batch = await _context.HarvestBatches
            .Include(b => b.FarmingLogs)
            .FirstOrDefaultAsync(b => b.BatchID == id);

        if (batch == null)
        {
            return NotFound(new { message = "Batch not found" });
        }

        // Check safety - all farming logs must have SafeAfterDate before harvest date
        var unsafeLogs = batch.FarmingLogs
            .Where(l => l.SafeAfterDate.HasValue && l.SafeAfterDate.Value > request.HarvestDate)
            .ToList();

        if (unsafeLogs.Any())
        {
            batch.IsSafe = false;
            return BadRequest(new 
            { 
                message = "Cannot harvest - safety period not met",
                unsafeLogs = unsafeLogs.Select(l => new 
                { 
                    l.LogID, 
                    l.ChemicalUsed, 
                    l.SafeAfterDate 
                })
            });
        }

        batch.ActualHarvest = request.HarvestDate;
        batch.Quantity = request.Quantity;
        batch.QualityGrade = request.QualityGrade;
        batch.Status = "Harvested";
        batch.IsSafe = true;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Batch harvested successfully", batch });
    }
}

public class HarvestRequest
{
    public DateTime HarvestDate { get; set; }
    public decimal? Quantity { get; set; }
    public string? QualityGrade { get; set; }
}
