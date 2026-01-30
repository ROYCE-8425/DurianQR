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
            .Include(l => l.Tree)
                .ThenInclude(t => t!.Farm)
            .Include(l => l.Chemical)
            .OrderByDescending(l => l.LogDate)
            .ToListAsync();
    }

    // GET: api/farminglogs/5
    [HttpGet("{id}")]
    public async Task<ActionResult<FarmingLog>> GetLog(int id)
    {
        var log = await _context.FarmingLogs
            .Include(l => l.Tree)
            .Include(l => l.Chemical)
            .FirstOrDefaultAsync(l => l.LogID == id);

        if (log == null)
        {
            return NotFound(new { message = "Log not found" });
        }

        return log;
    }

    // GET: api/farminglogs/tree/5 - Get logs by tree
    [HttpGet("tree/{treeId}")]
    public async Task<ActionResult<IEnumerable<FarmingLog>>> GetLogsByTree(int treeId)
    {
        return await _context.FarmingLogs
            .Where(l => l.TreeID == treeId)
            .Include(l => l.Chemical)
            .OrderByDescending(l => l.LogDate)
            .ToListAsync();
    }

    // GET: api/farminglogs/farm/5 - Get logs by farm
    [HttpGet("farm/{farmId}")]
    public async Task<ActionResult<IEnumerable<FarmingLog>>> GetLogsByFarm(int farmId)
    {
        return await _context.FarmingLogs
            .Where(l => l.Tree!.FarmID == farmId)
            .Include(l => l.Tree)
            .Include(l => l.Chemical)
            .OrderByDescending(l => l.LogDate)
            .ToListAsync();
    }

    // POST: api/farminglogs
    [HttpPost]
    public async Task<ActionResult<FarmingLog>> CreateLog([FromBody] CreateFarmingLogDTO dto)
    {
        // Validate tree
        var tree = await _context.DurianTrees.FindAsync(dto.TreeId);
        if (tree == null)
        {
            return NotFound(new { message = "Không tìm thấy cây" });
        }

        var log = new FarmingLog
        {
            TreeID = dto.TreeId,
            LogDate = dto.LogDate ?? DateTime.UtcNow,
            ActivityType = dto.ActivityType,
            Description = dto.Description,
            ChemicalUsed = dto.ChemicalUsed,
            DosageAmount = dto.DosageAmount,
            Unit = dto.Unit,
            ImagePath = dto.ImagePath,
            CreatedAt = DateTime.UtcNow
        };

        // Validate chemical if specified
        if (!string.IsNullOrEmpty(dto.ChemicalUsed))
        {
            var chemical = await _context.Chemicals
                .FirstOrDefaultAsync(c => c.ChemicalName.ToLower().Contains(dto.ChemicalUsed.ToLower()));

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
                log.ChemicalID = chemical.ChemicalID;
                log.SafetyDays = chemical.PHI_Days;
                log.SafeAfterDate = log.LogDate.AddDays(chemical.PHI_Days);
                log.IsAutoValidated = true;
            }
            else if (dto.SafetyDays.HasValue)
            {
                // Use custom PHI if chemical not found in database
                log.SafetyDays = dto.SafetyDays;
                log.SafeAfterDate = log.LogDate.AddDays(dto.SafetyDays.Value);
            }
        }

        _context.FarmingLogs.Add(log);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetLog), new { id = log.LogID }, new 
        { 
            log, 
            warning = log.SafeAfterDate.HasValue 
                ? $"⚠️ Cây sẽ an toàn thu hoạch sau ngày: {log.SafeAfterDate:dd/MM/yyyy}" 
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

        _context.FarmingLogs.Remove(log);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

// DTO
public class CreateFarmingLogDTO
{
    public int TreeId { get; set; }
    public DateTime? LogDate { get; set; }
    public string ActivityType { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ChemicalUsed { get; set; }
    public decimal? DosageAmount { get; set; }
    public string? Unit { get; set; }
    public int? SafetyDays { get; set; }
    public string? ImagePath { get; set; }
}
