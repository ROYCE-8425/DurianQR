using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DurianQR.API.Data;
using DurianQR.API.Models;
using QRCoder;
using System.Text.Json;

namespace DurianQR.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QRController : ControllerBase
{
    private readonly DurianQRContext _context;
    private readonly IWebHostEnvironment _env;

    public QRController(DurianQRContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    // GET: api/qr
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BatchQRCode>>> GetQRCodes()
    {
        return await _context.QRCodes
            .Include(q => q.Batch)
            .OrderByDescending(q => q.GeneratedAt)
            .ToListAsync();
    }

    // GET: api/qr/5
    [HttpGet("{id}")]
    public async Task<ActionResult<BatchQRCode>> GetQRCode(int id)
    {
        var qrCode = await _context.QRCodes
            .Include(q => q.Batch)
            .FirstOrDefaultAsync(q => q.QRID == id);

        if (qrCode == null)
        {
            return NotFound(new { message = "QR Code not found" });
        }

        return qrCode;
    }

    // POST: api/qr/generate/{batchId} - Generate QR for a batch
    [HttpPost("generate/{batchId}")]
    public async Task<ActionResult<BatchQRCode>> GenerateQR(int batchId)
    {
        var batch = await _context.HarvestBatches
            .Include(b => b.Tree)
                .ThenInclude(t => t!.Farm)
                    .ThenInclude(f => f!.User)
            .Include(b => b.FarmingLogs)
            .FirstOrDefaultAsync(b => b.BatchID == batchId);

        if (batch == null)
        {
            return NotFound(new { message = "Batch not found" });
        }

        // Check if batch is safe
        if (!batch.IsSafe)
        {
            return BadRequest(new { message = "Cannot generate QR - batch is not safe for harvest" });
        }

        // Check if any farming log has SafeAfterDate in the future
        var unsafeLogs = batch.FarmingLogs
            .Where(l => l.SafeAfterDate.HasValue && l.SafeAfterDate.Value > DateTime.UtcNow)
            .ToList();

        if (unsafeLogs.Any())
        {
            return BadRequest(new 
            { 
                message = "Cannot generate QR - safety period not met",
                safeAfterDate = unsafeLogs.Max(l => l.SafeAfterDate)
            });
        }

        // Create QR data with traceability info
        var qrData = new
        {
            batchCode = batch.BatchCode,
            url = $"https://trannhuy.online/trace/{batch.BatchCode}",
            generatedAt = DateTime.UtcNow
        };

        var qrDataJson = JsonSerializer.Serialize(qrData);

        // Generate QR Code image
        using var qrGenerator = new QRCodeGenerator();
        using var qrCodeData = qrGenerator.CreateQrCode(qrData.url, QRCodeGenerator.ECCLevel.Q);
        using var qrCodeImage = new PngByteQRCode(qrCodeData);
        var qrBytes = qrCodeImage.GetGraphic(10);

        // Save QR image
        var qrFolder = Path.Combine(_env.ContentRootPath, "wwwroot", "qrcodes");
        Directory.CreateDirectory(qrFolder);
        var qrFileName = $"{batch.BatchCode}.png";
        var qrFilePath = Path.Combine(qrFolder, qrFileName);
        await System.IO.File.WriteAllBytesAsync(qrFilePath, qrBytes);

        // Create QR record
        var qrCode = new BatchQRCode
        {
            BatchID = batchId,
            QRCodeData = qrDataJson,
            QRImagePath = $"/qrcodes/{qrFileName}",
            GeneratedAt = DateTime.UtcNow,
            IsActive = true
        };

        _context.QRCodes.Add(qrCode);
        
        // Update batch status
        batch.Status = "Exported";
        
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetQRCode), new { id = qrCode.QRID }, new 
        { 
            qrCode,
            qrImageUrl = qrCode.QRImagePath,
            traceUrl = qrData.url
        });
    }

    // GET: api/qr/image/{batchCode} - Get QR image by batch code
    [HttpGet("image/{batchCode}")]
    public async Task<IActionResult> GetQRImage(string batchCode)
    {
        var qrCode = await _context.QRCodes
            .FirstOrDefaultAsync(q => q.Batch!.BatchCode == batchCode);

        if (qrCode == null || string.IsNullOrEmpty(qrCode.QRImagePath))
        {
            return NotFound(new { message = "QR Image not found" });
        }

        var imagePath = Path.Combine(_env.ContentRootPath, "wwwroot", qrCode.QRImagePath.TrimStart('/'));
        
        if (!System.IO.File.Exists(imagePath))
        {
            return NotFound(new { message = "QR Image file not found" });
        }

        var imageBytes = await System.IO.File.ReadAllBytesAsync(imagePath);
        return File(imageBytes, "image/png");
    }

    // POST: api/qr/scan/{batchCode} - Record a scan
    [HttpPost("scan/{batchCode}")]
    public async Task<IActionResult> RecordScan(string batchCode)
    {
        var qrCode = await _context.QRCodes
            .FirstOrDefaultAsync(q => q.Batch!.BatchCode == batchCode);

        if (qrCode == null)
        {
            return NotFound(new { message = "QR Code not found" });
        }

        qrCode.ScanCount++;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Scan recorded", scanCount = qrCode.ScanCount });
    }
}
