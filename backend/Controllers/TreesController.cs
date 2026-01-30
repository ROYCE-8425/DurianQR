using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DurianQR.API.Data;
using DurianQR.API.Models;

namespace DurianQR.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TreesController : ControllerBase
{
    private readonly DurianQRContext _context;

    public TreesController(DurianQRContext context)
    {
        _context = context;
    }

    // GET: api/trees
    [HttpGet]
    public async Task<ActionResult<IEnumerable<DurianTree>>> GetTrees()
    {
        return await _context.DurianTrees
            .Include(t => t.Farm)
            .Include(t => t.FarmingLogs)
            .Include(t => t.HarvestRequests)
            .ToListAsync();
    }

    // GET: api/trees/5
    [HttpGet("{id}")]
    public async Task<ActionResult<DurianTree>> GetTree(int id)
    {
        var tree = await _context.DurianTrees
            .Include(t => t.Farm)
            .Include(t => t.FarmingLogs)
            .Include(t => t.HarvestRequests)
            .FirstOrDefaultAsync(t => t.TreeID == id);

        if (tree == null)
        {
            return NotFound(new { message = "Tree not found" });
        }

        return tree;
    }

    // GET: api/trees/farm/5 - Get trees by farm
    [HttpGet("farm/{farmId}")]
    public async Task<ActionResult<IEnumerable<DurianTree>>> GetTreesByFarm(int farmId)
    {
        return await _context.DurianTrees
            .Where(t => t.FarmID == farmId)
            .Include(t => t.FarmingLogs)
            .Include(t => t.HarvestRequests)
            .ToListAsync();
    }

    // POST: api/trees
    [HttpPost]
    public async Task<ActionResult<DurianTree>> CreateTree(DurianTree tree)
    {
        tree.CreatedAt = DateTime.UtcNow;
        _context.DurianTrees.Add(tree);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTree), new { id = tree.TreeID }, tree);
    }

    // PUT: api/trees/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTree(int id, DurianTree tree)
    {
        if (id != tree.TreeID)
        {
            return BadRequest(new { message = "ID mismatch" });
        }

        _context.Entry(tree).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await _context.DurianTrees.AnyAsync(t => t.TreeID == id))
            {
                return NotFound(new { message = "Tree not found" });
            }
            throw;
        }

        return NoContent();
    }

    // DELETE: api/trees/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTree(int id)
    {
        var tree = await _context.DurianTrees.FindAsync(id);
        if (tree == null)
        {
            return NotFound(new { message = "Tree not found" });
        }

        _context.DurianTrees.Remove(tree);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
