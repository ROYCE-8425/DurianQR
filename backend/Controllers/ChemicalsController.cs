using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DurianQR.API.Data;
using DurianQR.API.Models;

namespace DurianQR.API.Controllers;

/// <summary>
/// Controller quản lý thuốc BVTV / Hóa chất nông nghiệp
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ChemicalsController : ControllerBase
{
    private readonly DurianQRContext _context;

    public ChemicalsController(DurianQRContext context)
    {
        _context = context;
    }

    // GET: api/chemicals
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Chemical>>> GetChemicals()
    {
        return await _context.Chemicals
            .OrderBy(c => c.ChemicalName)
            .ToListAsync();
    }

    // GET: api/chemicals/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Chemical>> GetChemical(int id)
    {
        var chemical = await _context.Chemicals.FindAsync(id);

        if (chemical == null)
        {
            return NotFound(new { message = "Không tìm thấy hóa chất" });
        }

        return chemical;
    }

    // GET: api/chemicals/search?q=abamectin
    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<Chemical>>> SearchChemicals([FromQuery] string q)
    {
        if (string.IsNullOrWhiteSpace(q))
        {
            return await _context.Chemicals.Take(10).ToListAsync();
        }

        return await _context.Chemicals
            .Where(c => c.ChemicalName.ToLower().Contains(q.ToLower()) ||
                       (c.ActiveIngredient != null && c.ActiveIngredient.ToLower().Contains(q.ToLower())))
            .OrderBy(c => c.ChemicalName)
            .Take(20)
            .ToListAsync();
    }

    // GET: api/chemicals/safe - Get non-banned chemicals
    [HttpGet("safe")]
    public async Task<ActionResult<IEnumerable<Chemical>>> GetSafeChemicals([FromQuery] string? market = null)
    {
        var query = _context.Chemicals.Where(c => !c.IsBanned);

        if (!string.IsNullOrEmpty(market))
        {
            query = query.Where(c => c.TargetMarket != null && c.TargetMarket.Contains(market));
        }

        return await query.OrderBy(c => c.ChemicalName).ToListAsync();
    }

    // POST: api/chemicals
    [HttpPost]
    public async Task<ActionResult<Chemical>> CreateChemical([FromBody] CreateChemicalDTO dto)
    {
        // Check duplicate name
        if (await _context.Chemicals.AnyAsync(c => c.ChemicalName == dto.ChemicalName))
        {
            return BadRequest(new { message = "Tên hóa chất đã tồn tại" });
        }

        var chemical = new Chemical
        {
            ChemicalName = dto.ChemicalName,
            ActiveIngredient = dto.ActiveIngredient,
            PHI_Days = dto.PHI_Days,
            IsBanned = dto.IsBanned,
            TargetMarket = dto.TargetMarket,
            CreatedAt = DateTime.UtcNow
        };

        _context.Chemicals.Add(chemical);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetChemical), new { id = chemical.ChemicalID }, chemical);
    }

    // PUT: api/chemicals/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateChemical(int id, [FromBody] UpdateChemicalDTO dto)
    {
        var chemical = await _context.Chemicals.FindAsync(id);
        if (chemical == null)
        {
            return NotFound(new { message = "Không tìm thấy hóa chất" });
        }

        // Update fields
        if (!string.IsNullOrEmpty(dto.ChemicalName))
            chemical.ChemicalName = dto.ChemicalName;
        if (!string.IsNullOrEmpty(dto.ActiveIngredient))
            chemical.ActiveIngredient = dto.ActiveIngredient;
        if (dto.PHI_Days.HasValue)
            chemical.PHI_Days = dto.PHI_Days.Value;
        if (dto.IsBanned.HasValue)
            chemical.IsBanned = dto.IsBanned.Value;
        if (dto.TargetMarket != null)
            chemical.TargetMarket = dto.TargetMarket;

        await _context.SaveChangesAsync();

        return Ok(chemical);
    }

    // DELETE: api/chemicals/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteChemical(int id)
    {
        var chemical = await _context.Chemicals.FindAsync(id);
        if (chemical == null)
        {
            return NotFound(new { message = "Không tìm thấy hóa chất" });
        }

        // Check if chemical is being used in any logs
        var isInUse = await _context.FarmingLogs.AnyAsync(l => l.ChemicalID == id);
        if (isInUse)
        {
            return BadRequest(new { message = "Không thể xóa hóa chất đang được sử dụng trong nhật ký" });
        }

        _context.Chemicals.Remove(chemical);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // POST: api/chemicals/5/ban - Ban a chemical
    [HttpPost("{id}/ban")]
    public async Task<IActionResult> BanChemical(int id, [FromBody] BanChemicalDTO? dto = null)
    {
        var chemical = await _context.Chemicals.FindAsync(id);
        if (chemical == null)
        {
            return NotFound(new { message = "Không tìm thấy hóa chất" });
        }

        chemical.IsBanned = true;
        await _context.SaveChangesAsync();

        return Ok(new { message = $"Đã cấm sử dụng {chemical.ChemicalName}", chemical });
    }

    // POST: api/chemicals/5/unban - Unban a chemical
    [HttpPost("{id}/unban")]
    public async Task<IActionResult> UnbanChemical(int id)
    {
        var chemical = await _context.Chemicals.FindAsync(id);
        if (chemical == null)
        {
            return NotFound(new { message = "Không tìm thấy hóa chất" });
        }

        chemical.IsBanned = false;
        await _context.SaveChangesAsync();

        return Ok(new { message = $"Đã gỡ cấm {chemical.ChemicalName}", chemical });
    }
}

// DTOs
public class CreateChemicalDTO
{
    public string ChemicalName { get; set; } = string.Empty;
    public string? ActiveIngredient { get; set; }
    public int PHI_Days { get; set; } = 14;
    public bool IsBanned { get; set; } = false;
    public string? TargetMarket { get; set; }
}

public class UpdateChemicalDTO
{
    public string? ChemicalName { get; set; }
    public string? ActiveIngredient { get; set; }
    public int? PHI_Days { get; set; }
    public bool? IsBanned { get; set; }
    public string? TargetMarket { get; set; }
}

public class BanChemicalDTO
{
    public string? Reason { get; set; }
}
