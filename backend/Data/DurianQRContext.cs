using Microsoft.EntityFrameworkCore;
using DurianQR.API.Models;

namespace DurianQR.API.Data;

public class DurianQRContext : DbContext
{
    public DurianQRContext(DbContextOptions<DurianQRContext> options) : base(options)
    {
    }

    // DbSets - Tables
    public DbSet<User> Users { get; set; }
    public DbSet<Farm> Farms { get; set; }
    public DbSet<DurianTree> DurianTrees { get; set; }
    public DbSet<Warehouse> Warehouses { get; set; }
    public DbSet<HarvestRequest> HarvestRequests { get; set; }
    public DbSet<ProductBatch> ProductBatches { get; set; }
    public DbSet<BatchHarvestRequest> BatchHarvestRequests { get; set; }
    public DbSet<FarmingLog> FarmingLogs { get; set; }
    public DbSet<Chemical> Chemicals { get; set; }
    public DbSet<BatchQRCode> QRCodes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.Email);
            entity.HasIndex(e => e.Role);
        });

        // Farm configuration
        modelBuilder.Entity<Farm>(entity =>
        {
            entity.HasOne(f => f.User)
                  .WithMany(u => u.Farms)
                  .HasForeignKey(f => f.UserID)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // DurianTree configuration
        modelBuilder.Entity<DurianTree>(entity =>
        {
            entity.HasIndex(e => e.TreeCode);
            entity.HasOne(t => t.Farm)
                  .WithMany(f => f.Trees)
                  .HasForeignKey(t => t.FarmID)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Warehouse configuration
        modelBuilder.Entity<Warehouse>(entity =>
        {
            entity.HasIndex(e => e.WarehouseName);
            entity.HasOne(w => w.Manager)
                  .WithOne(u => u.ManagedWarehouse)
                  .HasForeignKey<Warehouse>(w => w.ManagerID)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // HarvestRequest configuration
        modelBuilder.Entity<HarvestRequest>(entity =>
        {
            entity.HasIndex(e => e.RequestCode).IsUnique();
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.ExpectedHarvestDate);
            
            entity.HasOne(r => r.Tree)
                  .WithMany(t => t.HarvestRequests)
                  .HasForeignKey(r => r.TreeID)
                  .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasOne(r => r.Farmer)
                  .WithMany(u => u.HarvestRequests)
                  .HasForeignKey(r => r.UserID)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // ProductBatch configuration
        modelBuilder.Entity<ProductBatch>(entity =>
        {
            entity.HasIndex(e => e.BatchCode).IsUnique();
            entity.HasIndex(e => e.ExportStatus);
            
            entity.HasOne(b => b.Warehouse)
                  .WithMany(w => w.ProductBatches)
                  .HasForeignKey(b => b.WarehouseID)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // BatchHarvestRequest (M-N) configuration
        modelBuilder.Entity<BatchHarvestRequest>(entity =>
        {
            entity.HasIndex(e => new { e.BatchID, e.RequestID }).IsUnique();
            
            entity.HasOne(bhr => bhr.Batch)
                  .WithMany(b => b.HarvestRequests)
                  .HasForeignKey(bhr => bhr.BatchID)
                  .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasOne(bhr => bhr.HarvestRequest)
                  .WithMany(r => r.BatchRequests)
                  .HasForeignKey(bhr => bhr.RequestID)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // FarmingLog configuration
        modelBuilder.Entity<FarmingLog>(entity =>
        {
            entity.HasIndex(e => e.LogDate);
            entity.HasIndex(e => e.ActivityType);
            
            entity.HasOne(l => l.Tree)
                  .WithMany(t => t.FarmingLogs)
                  .HasForeignKey(l => l.TreeID)
                  .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasOne(l => l.Chemical)
                  .WithMany(c => c.FarmingLogs)
                  .HasForeignKey(l => l.ChemicalID)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // Chemical configuration
        modelBuilder.Entity<Chemical>(entity =>
        {
            entity.HasIndex(e => e.ChemicalName);
        });

        // QRCode configuration
        modelBuilder.Entity<BatchQRCode>(entity =>
        {
            entity.HasOne(q => q.Batch)
                  .WithMany(b => b.QRCodes)
                  .HasForeignKey(q => q.BatchID)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Seed data for Chemicals (common pesticides with PHI)
        modelBuilder.Entity<Chemical>().HasData(
            new Chemical { ChemicalID = 1, ChemicalName = "Abamectin", ActiveIngredient = "Abamectin 1.8%", PHI_Days = 14, IsBanned = false, TargetMarket = "VN,CN" },
            new Chemical { ChemicalID = 2, ChemicalName = "Chlorpyrifos", ActiveIngredient = "Chlorpyrifos 48%", PHI_Days = 21, IsBanned = true, TargetMarket = "EU" },
            new Chemical { ChemicalID = 3, ChemicalName = "Imidacloprid", ActiveIngredient = "Imidacloprid 10%", PHI_Days = 14, IsBanned = false, TargetMarket = "VN,CN" },
            new Chemical { ChemicalID = 4, ChemicalName = "Mancozeb", ActiveIngredient = "Mancozeb 80%", PHI_Days = 7, IsBanned = false, TargetMarket = "VN" },
            new Chemical { ChemicalID = 5, ChemicalName = "Thiamethoxam", ActiveIngredient = "Thiamethoxam 25%", PHI_Days = 14, IsBanned = true, TargetMarket = "EU" }
        );

        // Seed data for Warehouses
        modelBuilder.Entity<Warehouse>().HasData(
            new Warehouse { WarehouseID = 1, WarehouseName = "HTX Krông Pắk", Location = "Huyện Krông Pắk, Đắk Lắk" },
            new Warehouse { WarehouseID = 2, WarehouseName = "HTX Cư M'gar", Location = "Huyện Cư M'gar, Đắk Lắk" }
        );
    }
}
