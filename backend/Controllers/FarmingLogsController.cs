using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DurianQR.API.Data;
using DurianQR.API.Models;

namespace DurianQR.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FarmingLogsController : ControllerBase
{
    private readonly DurianQRContext _context;

    public FarmingLogsController(DurianQRContext context)
    {
        _context = context;
    }

    // GET: api/farminglogs
    [HttpGet]
    public async Task<ActionResult<IEnumerable<FarmingLog>>> GetLogs()
    {
        return await _context.FarmingLogs
            .Include(l => l.Batch)
            .OrderByDescending(l => l.LogDate)
            .ToListAsync();
    }

    // GET: api/farminglogs/5
    [HttpGet("{id}")]
    public async Task<ActionResult<FarmingLog>> GetLog(int id)
    {
        var log = await _context.FarmingLogs
            .Include(l => l.Batch)
            .FirstOrDefaultAsync(l => l.LogID == id);

        if (log == null)
        {
            return NotFound(new { message = "Log not found" });
        }

        return log;
    }

    // GET: api/farminglogs/batch/5 - Get logs by batch
    [HttpGet("batch/{batchId}")]
    public async Task<ActionResult<IEnumerable<FarmingLog>>> GetLogsByBatch(int batchId)
    {
        return await _context.FarmingLogs
            .Where(l => l.BatchID == batchId)
            .OrderByDescending(l => l.LogDate)
            .ToListAsync();
    }

    // POST: api/farminglogs
    [HttpPost]
    public async Task<ActionResult<FarmingLog>> CreateLog(FarmingLog log)
    {
        // Validate chemical if specified
        if (!string.IsNullOrEmpty(log.ChemicalUsed))
        {
            var chemical = await _context.Chemicals
                .FirstOrDefaultAsync(c => c.ChemicalName.ToLower().Contains(log.ChemicalUsed.ToLower()));

            if (chemical != null)
            {
                // Check if chemical is banned
                if (chemical.IsBanned)
                {
                    return BadRequest(new 
                    { 
                        message = $"⚠️ Cảnh báo: {chemical.ChemicalName} đã bị cấm sử dụng!",
                        chemical = chemical
                    });
                }

                // Calculate SafeAfterDate based on PHI
                log.SafetyDays = chemical.PHI_Days;
                log.SafeAfterDate = log.LogDate.AddDays(chemical.PHI_Days);
                log.IsAutoValidated = true;
            }
        }

        log.CreatedAt = DateTime.UtcNow;
        _context.FarmingLogs.Add(log);
        await _context.SaveChangesAsync();

        // Update batch safety status
        await UpdateBatchSafetyStatus(log.BatchID);

        return CreatedAtAction(nameof(GetLog), new { id = log.LogID }, new 
        { 
            log, 
            warning = log.SafeAfterDate.HasValue 
                ? $"⚠️ Lô hàng sẽ an toàn sau ngày: {log.SafeAfterDate:dd/MM/yyyy}" 
                : null 
        });
    }

    // PUT: api/farminglogs/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateLog(int id, FarmingLog log)
    {
        if (id != log.LogID)
        {
            return BadRequest(new { message = "ID mismatch" });
        }

        _context.Entry(log).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
            await UpdateBatchSafetyStatus(log.BatchID);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await _context.FarmingLogs.AnyAsync(l => l.LogID == id))
            {
                return NotFound(new { message = "Log not found" });
            }
            throw;
        }

        return NoContent();
    }

    // DELETE: api/farminglogs/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteLog(int id)
    {
        var log = await _context.FarmingLogs.FindAsync(id);
        if (log == null)
        {
            return NotFound(new { message = "Log not found" });
        }

        var batchId = log.BatchID;
        _context.FarmingLogs.Remove(log);
        await _context.SaveChangesAsync();

        // Update batch safety status after deletion
        await UpdateBatchSafetyStatus(batchId);

        return NoContent();
    }

    // Helper method to update batch safety status
    private async Task UpdateBatchSafetyStatus(int batchId)
    {
        var batch = await _context.HarvestBatches
            .Include(b => b.FarmingLogs)
            .FirstOrDefaultAsync(b => b.BatchID == batchId);

        if (batch != null)
        {
            // Check if any log has SafeAfterDate in the future
            var hasUnsafeLogs = batch.FarmingLogs
                .Any(l => l.SafeAfterDate.HasValue && l.SafeAfterDate.Value > DateTime.UtcNow);

            batch.IsSafe = !hasUnsafeLogs;
            await _context.SaveChangesAsync();
        }
    }
}
