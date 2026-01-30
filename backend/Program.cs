using Microsoft.EntityFrameworkCore;
using DurianQR.API.Data;

var builder = WebApplication.CreateBuilder(args);

// ===========================================
// Add services to the container
// ===========================================

// Database Context - MySQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<DurianQRContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// Controllers
builder.Services.AddControllers();

// CORS - Allow frontend to access API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",  // Vite dev server
                "http://localhost:3000",  // Alternative dev server
                "https://trannhuy.online" // Production
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

var app = builder.Build();

// ===========================================
// Configure the HTTP request pipeline
// ===========================================

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    // Swagger UI at /swagger
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "DurianQR API v1");
        options.RoutePrefix = "swagger";
    });
}

// Enable CORS
app.UseCors("AllowFrontend");

// Map Controllers
app.MapControllers();

// Health check endpoint
app.MapGet("/", () => Results.Ok(new 
{ 
    message = "DurianQR API is running!",
    version = "1.0.0",
    documentation = "/swagger"
}));

// Auto-migrate database on startup (Development only)
/*
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<DurianQRContext>();
    try
    {
        context.Database.Migrate();
        Console.WriteLine("✅ Database migrated successfully!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"⚠️ Database migration failed: {ex.Message}");
        Console.WriteLine("Run 'dotnet ef database update' manually.");
    }
}
*/

app.Run();
