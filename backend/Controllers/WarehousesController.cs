using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DurianQR.API.Data;
using DurianQR.API.Models;

namespace DurianQR.API.Controllers;

/// <summary>
/// Controller quản lý Kho / Hợp tác xã
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class WarehousesController : ControllerBase
{
    private readonly DurianQRContext _context;

    public WarehousesController(DurianQRContext context)
    {
        _context = context;
    }

    // GET: api/warehouses
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetWarehouses()
    {
        var warehouses = await _context.Warehouses
            .Include(w => w.Manager)
            .Select(w => new
            {
                w.WarehouseID,
                w.WarehouseName,
                w.Location,
                w.Coordinates,
                w.CreatedAt,
                Manager = w.Manager == null ? null : new
                {
                    w.Manager.UserID,
                    w.Manager.FullName,
                    w.Manager.Phone
                },
                BatchCount = w.ProductBatches.Count,
                TotalWeightKg = w.ProductBatches.Sum(b => b.TotalWeight ?? 0)
            })
            .ToListAsync();

        return Ok(warehouses);
    }

    // GET: api/warehouses/5
    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetWarehouse(int id)
    {
        var warehouse = await _context.Warehouses
            .Include(w => w.Manager)
            .Include(w => w.ProductBatches)
            .Where(w => w.WarehouseID == id)
            .Select(w => new
            {
                w.WarehouseID,
                w.WarehouseName,
                w.Location,
                w.Coordinates,
                w.CreatedAt,
                Manager = w.Manager == null ? null : new
                {
                    w.Manager.UserID,
                    w.Manager.FullName,
                    w.Manager.Phone,
                    w.Manager.Email
                },
                Stats = new
                {
                    TotalBatches = w.ProductBatches.Count,
                    InWarehouse = w.ProductBatches.Count(b => b.ExportStatus == "InWarehouse"),
                    Shipped = w.ProductBatches.Count(b => b.ExportStatus == "Shipped"),
                    TotalWeightKg = w.ProductBatches.Sum(b => b.TotalWeight ?? 0)
                }
            })
            .FirstOrDefaultAsync();

        if (warehouse == null)
        {
            return NotFound(new { message = "Không tìm thấy kho" });
        }

        return Ok(warehouse);
    }

    // GET: api/warehouses/5/batches - Get batches in warehouse
    [HttpGet("{id}/batches")]
    public async Task<ActionResult<IEnumerable<ProductBatch>>> GetWarehouseBatches(int id, [FromQuery] string? status = null)
    {
        var warehouse = await _context.Warehouses.FindAsync(id);
        if (warehouse == null)
        {
            return NotFound(new { message = "Không tìm thấy kho" });
        }

        var query = _context.ProductBatches
            .Where(b => b.WarehouseID == id)
            .Include(b => b.QRCodes);

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(b => b.ExportStatus == status).Include(b => b.QRCodes);
        }

        return await query.OrderByDescending(b => b.CreatedAt).ToListAsync();
    }

    // GET: api/warehouses/5/stats - Get warehouse statistics
    [HttpGet("{id}/stats")]
    public async Task<ActionResult<object>> GetWarehouseStats(int id)
    {
        var warehouse = await _context.Warehouses.FindAsync(id);
        if (warehouse == null)
        {
            return NotFound(new { message = "Không tìm thấy kho" });
        }

        var batches = await _context.ProductBatches
            .Where(b => b.WarehouseID == id)
            .ToListAsync();

        var stats = new
        {
            WarehouseID = id,
            TotalBatches = batches.Count,
            ByStatus = new
            {
                InWarehouse = batches.Count(b => b.ExportStatus == "InWarehouse"),
                Packed = batches.Count(b => b.ExportStatus == "Packed"),
                Shipped = batches.Count(b => b.ExportStatus == "Shipped"),
                Delivered = batches.Count(b => b.ExportStatus == "Delivered")
            },
            TotalWeight = new
            {
                AllKg = batches.Sum(b => b.TotalWeight ?? 0),
                GradeA_Kg = batches.Sum(b => b.GradeA_Weight ?? 0),
                GradeB_Kg = batches.Sum(b => b.GradeB_Weight ?? 0),
                GradeC_Kg = batches.Sum(b => b.GradeC_Weight ?? 0)
            },
            SafeBatches = batches.Count(b => b.IsSafe),
            UnsafeBatches = batches.Count(b => !b.IsSafe)
        };

        return Ok(stats);
    }

    // POST: api/warehouses
    [HttpPost]
    public async Task<ActionResult<Warehouse>> CreateWarehouse([FromBody] CreateWarehouseDTO dto)
    {
        // Check duplicate name
        if (await _context.Warehouses.AnyAsync(w => w.WarehouseName == dto.WarehouseName))
        {
            return BadRequest(new { message = "Tên kho đã tồn tại" });
        }

        var warehouse = new Warehouse
        {
            WarehouseName = dto.WarehouseName,
            Location = dto.Location,
            Coordinates = dto.Coordinates,
            ManagerID = dto.ManagerID,
            CreatedAt = DateTime.UtcNow
        };

        _context.Warehouses.Add(warehouse);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetWarehouse), new { id = warehouse.WarehouseID }, warehouse);
    }

    // PUT: api/warehouses/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateWarehouse(int id, [FromBody] UpdateWarehouseDTO dto)
    {
        var warehouse = await _context.Warehouses.FindAsync(id);
        if (warehouse == null)
        {
            return NotFound(new { message = "Không tìm thấy kho" });
        }

        if (!string.IsNullOrEmpty(dto.WarehouseName))
            warehouse.WarehouseName = dto.WarehouseName;
        if (dto.Location != null)
            warehouse.Location = dto.Location;
        if (dto.Coordinates != null)
            warehouse.Coordinates = dto.Coordinates;
        if (dto.ManagerID.HasValue)
            warehouse.ManagerID = dto.ManagerID;

        await _context.SaveChangesAsync();

        return Ok(warehouse);
    }

    // PUT: api/warehouses/5/assign-manager
    [HttpPut("{id}/assign-manager")]
    public async Task<IActionResult> AssignManager(int id, [FromBody] AssignManagerDTO dto)
    {
        var warehouse = await _context.Warehouses.FindAsync(id);
        if (warehouse == null)
        {
            return NotFound(new { message = "Không tìm thấy kho" });
        }

        // Verify manager exists and is a Trader
        var manager = await _context.Users.FindAsync(dto.ManagerID);
        if (manager == null)
        {
            return NotFound(new { message = "Không tìm thấy người dùng" });
        }

        if (manager.Role != "Trader" && manager.Role != "Admin")
        {
            return BadRequest(new { message = "Chỉ có Thương lái hoặc Admin mới có thể làm thủ kho" });
        }

        warehouse.ManagerID = dto.ManagerID;
        await _context.SaveChangesAsync();

        return Ok(new { message = $"Đã gán {manager.FullName} làm thủ kho", warehouse });
    }

    // DELETE: api/warehouses/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteWarehouse(int id)
    {
        var warehouse = await _context.Warehouses.FindAsync(id);
        if (warehouse == null)
        {
            return NotFound(new { message = "Không tìm thấy kho" });
        }

        // Check if warehouse has any batches
        var hasBatches = await _context.ProductBatches.AnyAsync(b => b.WarehouseID == id);
        if (hasBatches)
        {
            return BadRequest(new { message = "Không thể xóa kho đang có lô hàng" });
        }

        _context.Warehouses.Remove(warehouse);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

// DTOs
public class CreateWarehouseDTO
{
    public string WarehouseName { get; set; } = string.Empty;
    public string? Location { get; set; }
    public string? Coordinates { get; set; }
    public int? ManagerID { get; set; }
}

public class UpdateWarehouseDTO
{
    public string? WarehouseName { get; set; }
    public string? Location { get; set; }
    public string? Coordinates { get; set; }
    public int? ManagerID { get; set; }
}

public class AssignManagerDTO
{
    public int ManagerID { get; set; }
}
