using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DurianQR.API.Data;
using DurianQR.API.Models;

namespace DurianQR.API.Controllers;

/// <summary>
/// Controller quản lý Users (Admin only)
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly DurianQRContext _context;

    public UsersController(DurianQRContext context)
    {
        _context = context;
    }

    // GET: api/users
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetUsers([FromQuery] string? role = null)
    {
        var query = _context.Users.AsQueryable();

        if (!string.IsNullOrEmpty(role))
        {
            query = query.Where(u => u.Role == role);
        }

        var users = await query
            .Select(u => new
            {
                u.UserID,
                u.Username,
                u.FullName,
                u.Phone,
                u.Email,
                u.Role,
                u.CreatedAt,
                FarmCount = u.Farms.Count,
                RequestCount = u.HarvestRequests.Count
            })
            .OrderBy(u => u.FullName)
            .ToListAsync();

        return Ok(users);
    }

    // GET: api/users/5
    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetUser(int id)
    {
        var user = await _context.Users
            .Include(u => u.Farms)
                .ThenInclude(f => f.Trees)
            .Include(u => u.HarvestRequests)
            .Where(u => u.UserID == id)
            .Select(u => new
            {
                u.UserID,
                u.Username,
                u.FullName,
                u.Phone,
                u.Email,
                u.Role,
                u.CreatedAt,
                Farms = u.Farms.Select(f => new
                {
                    f.FarmID,
                    f.FarmName,
                    f.Location,
                    f.Area,
                    TreeCount = f.Trees.Count
                }),
                Stats = new
                {
                    TotalFarms = u.Farms.Count,
                    TotalTrees = u.Farms.SelectMany(f => f.Trees).Count(),
                    TotalRequests = u.HarvestRequests.Count,
                    CompletedRequests = u.HarvestRequests.Count(r => r.Status == "Completed"),
                    PendingRequests = u.HarvestRequests.Count(r => r.Status == "Pending")
                }
            })
            .FirstOrDefaultAsync();

        if (user == null)
        {
            return NotFound(new { message = "Không tìm thấy người dùng" });
        }

        return Ok(user);
    }

    // GET: api/users/farmers - Get all farmers
    [HttpGet("farmers")]
    public async Task<ActionResult<IEnumerable<object>>> GetFarmers()
    {
        var farmers = await _context.Users
            .Where(u => u.Role == "Farmer")
            .Include(u => u.Farms)
            .Select(u => new
            {
                u.UserID,
                u.Username,
                u.FullName,
                u.Phone,
                u.Email,
                u.CreatedAt,
                FarmCount = u.Farms.Count,
                TotalArea = u.Farms.Sum(f => f.Area ?? 0),
                TreeCount = u.Farms.SelectMany(f => f.Trees).Count()
            })
            .OrderBy(u => u.FullName)
            .ToListAsync();

        return Ok(farmers);
    }

    // GET: api/users/traders - Get all traders
    [HttpGet("traders")]
    public async Task<ActionResult<IEnumerable<object>>> GetTraders()
    {
        var traders = await _context.Users
            .Where(u => u.Role == "Trader")
            .Include(u => u.ManagedWarehouse)
            .Select(u => new
            {
                u.UserID,
                u.Username,
                u.FullName,
                u.Phone,
                u.Email,
                u.CreatedAt,
                ManagedWarehouse = u.ManagedWarehouse == null ? null : new
                {
                    u.ManagedWarehouse.WarehouseID,
                    u.ManagedWarehouse.WarehouseName,
                    u.ManagedWarehouse.Location
                }
            })
            .OrderBy(u => u.FullName)
            .ToListAsync();

        return Ok(traders);
    }

    // GET: api/users/5/farms - Get user's farms
    [HttpGet("{id}/farms")]
    public async Task<ActionResult<IEnumerable<Farm>>> GetUserFarms(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound(new { message = "Không tìm thấy người dùng" });
        }

        var farms = await _context.Farms
            .Where(f => f.UserID == id)
            .Include(f => f.Trees)
            .ToListAsync();

        return Ok(farms);
    }

    // GET: api/users/5/requests - Get user's harvest requests
    [HttpGet("{id}/requests")]
    public async Task<ActionResult<IEnumerable<object>>> GetUserRequests(int id, [FromQuery] string? status = null)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound(new { message = "Không tìm thấy người dùng" });
        }

        var query = _context.HarvestRequests
            .Where(r => r.UserID == id);

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(r => r.Status == status);
        }

        var requests = await query
            .Include(r => r.Tree)
                .ThenInclude(t => t!.Farm)
            .OrderByDescending(r => r.RequestDate)
            .Select(r => new
            {
                r.RequestID,
                r.RequestCode,
                r.RequestDate,
                r.ExpectedHarvestDate,
                r.EstimatedQuantity,
                r.ActualQuantity,
                r.Status,
                Tree = new
                {
                    r.Tree!.TreeCode,
                    r.Tree.Variety,
                    Farm = new
                    {
                        r.Tree.Farm!.FarmName,
                        r.Tree.Farm.Location
                    }
                }
            })
            .ToListAsync();

        return Ok(requests);
    }

    // PUT: api/users/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDTO dto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound(new { message = "Không tìm thấy người dùng" });
        }

        if (!string.IsNullOrEmpty(dto.FullName))
            user.FullName = dto.FullName;
        if (dto.Phone != null)
            user.Phone = dto.Phone;
        if (dto.Email != null)
            user.Email = dto.Email;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            user.UserID,
            user.Username,
            user.FullName,
            user.Phone,
            user.Email,
            user.Role
        });
    }

    // PUT: api/users/5/role - Change user role (Admin only)
    [HttpPut("{id}/role")]
    public async Task<IActionResult> ChangeRole(int id, [FromBody] ChangeRoleDTO dto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound(new { message = "Không tìm thấy người dùng" });
        }

        // Validate role
        var validRoles = new[] { "Farmer", "Trader", "Admin" };
        if (!validRoles.Contains(dto.Role))
        {
            return BadRequest(new { message = "Role không hợp lệ. Chỉ chấp nhận: Farmer, Trader, Admin" });
        }

        user.Role = dto.Role;
        await _context.SaveChangesAsync();

        return Ok(new { message = $"Đã thay đổi role của {user.FullName} thành {dto.Role}", user.UserID, user.Role });
    }

    // DELETE: api/users/5 (Soft delete - just mark as inactive, or hard delete if no data)
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users
            .Include(u => u.Farms)
            .Include(u => u.HarvestRequests)
            .FirstOrDefaultAsync(u => u.UserID == id);

        if (user == null)
        {
            return NotFound(new { message = "Không tìm thấy người dùng" });
        }

        // Check if user has any data
        if (user.Farms.Any() || user.HarvestRequests.Any())
        {
            return BadRequest(new 
            { 
                message = "Không thể xóa người dùng có dữ liệu. Vui lòng xóa farms và requests trước.",
                farmCount = user.Farms.Count,
                requestCount = user.HarvestRequests.Count
            });
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // GET: api/users/stats - Get overall user statistics
    [HttpGet("stats")]
    public async Task<ActionResult<object>> GetUserStats()
    {
        var stats = new
        {
            Total = await _context.Users.CountAsync(),
            ByRole = new
            {
                Farmers = await _context.Users.CountAsync(u => u.Role == "Farmer"),
                Traders = await _context.Users.CountAsync(u => u.Role == "Trader"),
                Admins = await _context.Users.CountAsync(u => u.Role == "Admin")
            },
            NewThisMonth = await _context.Users
                .CountAsync(u => u.CreatedAt.Month == DateTime.UtcNow.Month && 
                                u.CreatedAt.Year == DateTime.UtcNow.Year)
        };

        return Ok(stats);
    }
}

// DTOs
public class UpdateUserDTO
{
    public string? FullName { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
}

public class ChangeRoleDTO
{
    public string Role { get; set; } = string.Empty;
}
