using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DurianQR.API.Data;
using DurianQR.API.Models;

namespace DurianQR.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FarmsController : ControllerBase
{
    private readonly DurianQRContext _context;

    public FarmsController(DurianQRContext context)
    {
        _context = context;
    }

    // GET: api/farms
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Farm>>> GetFarms()
    {
        return await _context.Farms
            .Include(f => f.User)
            .Include(f => f.Trees)
            .ToListAsync();
    }

    // GET: api/farms/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Farm>> GetFarm(int id)
    {
        var farm = await _context.Farms
            .Include(f => f.User)
            .Include(f => f.Trees)
            .FirstOrDefaultAsync(f => f.FarmID == id);

        if (farm == null)
        {
            return NotFound(new { message = "Farm not found" });
        }

        return farm;
    }

    // POST: api/farms
    [HttpPost]
    public async Task<ActionResult<Farm>> CreateFarm(Farm farm)
    {
        farm.CreatedAt = DateTime.UtcNow;
        _context.Farms.Add(farm);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetFarm), new { id = farm.FarmID }, farm);
    }

    // PUT: api/farms/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateFarm(int id, Farm farm)
    {
        if (id != farm.FarmID)
        {
            return BadRequest(new { message = "ID mismatch" });
        }

        _context.Entry(farm).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await _context.Farms.AnyAsync(f => f.FarmID == id))
            {
                return NotFound(new { message = "Farm not found" });
            }
            throw;
        }

        return NoContent();
    }

    // DELETE: api/farms/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFarm(int id)
    {
        var farm = await _context.Farms.FindAsync(id);
        if (farm == null)
        {
            return NotFound(new { message = "Farm not found" });
        }

        _context.Farms.Remove(farm);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
