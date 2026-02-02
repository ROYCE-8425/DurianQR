using QRCoder;

namespace DurianQR.API.Utilities;

/// <summary>
/// Utility class for generating QR Code images
/// </summary>
public static class QRCodeGenerator
{
    /// <summary>
    /// Generate QR Code image as byte array (PNG format)
    /// </summary>
    /// <param name="text">Text or URL to encode in QR</param>
    /// <param name="width">Width of QR image in pixels (default: 200)</param>
    /// <param name="height">Height of QR image in pixels (default: 200)</param>
    /// <returns>PNG image as byte array</returns>
    public static byte[] GenerateQRCodeImage(string text, int width = 200, int height = 200)
    {
        // Calculate pixel per module based on desired size
        // QR code standard is about 21x21 modules minimum, so 10 ppn gives ~210px
        int pixelsPerModule = Math.Max(1, width / 25);
        
        using var qrGenerator = new QRCoder.QRCodeGenerator();
        using var qrCodeData = qrGenerator.CreateQrCode(text, QRCoder.QRCodeGenerator.ECCLevel.Q);
        using var qrCode = new PngByteQRCode(qrCodeData);
        
        return qrCode.GetGraphic(pixelsPerModule);
    }
    
    /// <summary>
    /// Generate QR Code image with custom colors
    /// </summary>
    public static byte[] GenerateQRCodeImage(string text, int pixelsPerModule, byte[] darkColor, byte[] lightColor)
    {
        using var qrGenerator = new QRCoder.QRCodeGenerator();
        using var qrCodeData = qrGenerator.CreateQrCode(text, QRCoder.QRCodeGenerator.ECCLevel.Q);
        using var qrCode = new PngByteQRCode(qrCodeData);
        
        return qrCode.GetGraphic(pixelsPerModule, darkColor, lightColor);
    }
    
    /// <summary>
    /// Generate trace URL for a batch code
    /// </summary>
    public static string GenerateTraceUrl(string batchCode, string? baseUrl = null)
    {
        baseUrl ??= "https://durianqr.trannhuy.online";
        return $"{baseUrl}/trace/{batchCode}";
    }
}
