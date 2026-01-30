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
    public DbSet<HarvestBatch> HarvestBatches { get; set; }
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

        // HarvestBatch configuration
        modelBuilder.Entity<HarvestBatch>(entity =>
        {
            entity.HasIndex(e => e.BatchCode).IsUnique();
            entity.HasOne(b => b.Tree)
                  .WithMany(t => t.Batches)
                  .HasForeignKey(b => b.TreeID)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // FarmingLog configuration
        modelBuilder.Entity<FarmingLog>(entity =>
        {
            entity.HasIndex(e => e.LogDate);
            entity.HasOne(l => l.Batch)
                  .WithMany(b => b.FarmingLogs)
                  .HasForeignKey(l => l.BatchID)
                  .OnDelete(DeleteBehavior.Cascade);
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
    }
}
