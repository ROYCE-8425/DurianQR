using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace DurianQR.API.Migrations
{
    /// <inheritdoc />
    public partial class HarvestWorkflow : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Chemicals",
                columns: table => new
                {
                    ChemicalID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ChemicalName = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ActiveIngredient = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PHI_Days = table.Column<int>(type: "int", nullable: false),
                    IsBanned = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    TargetMarket = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Chemicals", x => x.ChemicalID);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Username = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PasswordHash = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FullName = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Phone = table.Column<string>(type: "varchar(15)", maxLength: 15, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Email = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Role = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserID);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Farms",
                columns: table => new
                {
                    FarmID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    FarmName = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Location = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Area = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    Coordinates = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Farms", x => x.FarmID);
                    table.ForeignKey(
                        name: "FK_Farms_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Warehouses",
                columns: table => new
                {
                    WarehouseID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    WarehouseName = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Location = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Coordinates = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ManagerID = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Warehouses", x => x.WarehouseID);
                    table.ForeignKey(
                        name: "FK_Warehouses_Users_ManagerID",
                        column: x => x.ManagerID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.SetNull);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "DurianTrees",
                columns: table => new
                {
                    TreeID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    FarmID = table.Column<int>(type: "int", nullable: false),
                    TreeCode = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Variety = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PlantingYear = table.Column<int>(type: "int", nullable: true),
                    Status = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DurianTrees", x => x.TreeID);
                    table.ForeignKey(
                        name: "FK_DurianTrees_Farms_FarmID",
                        column: x => x.FarmID,
                        principalTable: "Farms",
                        principalColumn: "FarmID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ProductBatches",
                columns: table => new
                {
                    BatchID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    WarehouseID = table.Column<int>(type: "int", nullable: true),
                    BatchCode = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    BatchType = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TotalWeight = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    GradeA_Weight = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    GradeB_Weight = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    GradeC_Weight = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    QualityGrade = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TargetMarket = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PackingDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ExportStatus = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsSafe = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Notes = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductBatches", x => x.BatchID);
                    table.ForeignKey(
                        name: "FK_ProductBatches_Warehouses_WarehouseID",
                        column: x => x.WarehouseID,
                        principalTable: "Warehouses",
                        principalColumn: "WarehouseID",
                        onDelete: ReferentialAction.SetNull);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "FarmingLogs",
                columns: table => new
                {
                    LogID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    TreeID = table.Column<int>(type: "int", nullable: false),
                    LogDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ActivityType = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ChemicalUsed = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ChemicalID = table.Column<int>(type: "int", nullable: true),
                    DosageAmount = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    Unit = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SafetyDays = table.Column<int>(type: "int", nullable: true),
                    SafeAfterDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ImagePath = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsAutoValidated = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FarmingLogs", x => x.LogID);
                    table.ForeignKey(
                        name: "FK_FarmingLogs_Chemicals_ChemicalID",
                        column: x => x.ChemicalID,
                        principalTable: "Chemicals",
                        principalColumn: "ChemicalID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_FarmingLogs_DurianTrees_TreeID",
                        column: x => x.TreeID,
                        principalTable: "DurianTrees",
                        principalColumn: "TreeID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "HarvestRequests",
                columns: table => new
                {
                    RequestID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    TreeID = table.Column<int>(type: "int", nullable: false),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    RequestCode = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    RequestDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ExpectedHarvestDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    EstimatedQuantity = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    Status = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ApprovalNote = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PHICheckResult = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SafeAfterDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ApprovedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ApprovedBy = table.Column<int>(type: "int", nullable: true),
                    CheckedInAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    CheckedInBy = table.Column<int>(type: "int", nullable: true),
                    ActualQuantity = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    GradeA_Quantity = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    GradeB_Quantity = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    GradeC_Quantity = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    CompletedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HarvestRequests", x => x.RequestID);
                    table.ForeignKey(
                        name: "FK_HarvestRequests_DurianTrees_TreeID",
                        column: x => x.TreeID,
                        principalTable: "DurianTrees",
                        principalColumn: "TreeID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HarvestRequests_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "QRCodes",
                columns: table => new
                {
                    QRID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    BatchID = table.Column<int>(type: "int", nullable: false),
                    QRCodeData = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    QRImagePath = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    GeneratedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ScanCount = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QRCodes", x => x.QRID);
                    table.ForeignKey(
                        name: "FK_QRCodes_ProductBatches_BatchID",
                        column: x => x.BatchID,
                        principalTable: "ProductBatches",
                        principalColumn: "BatchID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "BatchHarvestRequests",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    BatchID = table.Column<int>(type: "int", nullable: false),
                    RequestID = table.Column<int>(type: "int", nullable: false),
                    ContributedWeight = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    AddedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BatchHarvestRequests", x => x.ID);
                    table.ForeignKey(
                        name: "FK_BatchHarvestRequests_HarvestRequests_RequestID",
                        column: x => x.RequestID,
                        principalTable: "HarvestRequests",
                        principalColumn: "RequestID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BatchHarvestRequests_ProductBatches_BatchID",
                        column: x => x.BatchID,
                        principalTable: "ProductBatches",
                        principalColumn: "BatchID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Chemicals",
                columns: new[] { "ChemicalID", "ActiveIngredient", "ChemicalName", "CreatedAt", "IsBanned", "PHI_Days", "TargetMarket" },
                values: new object[,]
                {
                    { 1, "Abamectin 1.8%", "Abamectin", new DateTime(2026, 1, 30, 19, 37, 12, 586, DateTimeKind.Utc).AddTicks(1011), false, 14, "VN,CN" },
                    { 2, "Chlorpyrifos 48%", "Chlorpyrifos", new DateTime(2026, 1, 30, 19, 37, 12, 586, DateTimeKind.Utc).AddTicks(2037), true, 21, "EU" },
                    { 3, "Imidacloprid 10%", "Imidacloprid", new DateTime(2026, 1, 30, 19, 37, 12, 586, DateTimeKind.Utc).AddTicks(2040), false, 14, "VN,CN" },
                    { 4, "Mancozeb 80%", "Mancozeb", new DateTime(2026, 1, 30, 19, 37, 12, 586, DateTimeKind.Utc).AddTicks(2041), false, 7, "VN" },
                    { 5, "Thiamethoxam 25%", "Thiamethoxam", new DateTime(2026, 1, 30, 19, 37, 12, 586, DateTimeKind.Utc).AddTicks(2043), true, 14, "EU" }
                });

            migrationBuilder.InsertData(
                table: "Warehouses",
                columns: new[] { "WarehouseID", "Coordinates", "CreatedAt", "Location", "ManagerID", "WarehouseName" },
                values: new object[,]
                {
                    { 1, null, new DateTime(2026, 1, 30, 19, 37, 12, 586, DateTimeKind.Utc).AddTicks(6870), "Huyện Krông Pắk, Đắk Lắk", null, "HTX Krông Pắk" },
                    { 2, null, new DateTime(2026, 1, 30, 19, 37, 12, 586, DateTimeKind.Utc).AddTicks(7750), "Huyện Cư M'gar, Đắk Lắk", null, "HTX Cư M'gar" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_BatchHarvestRequests_BatchID_RequestID",
                table: "BatchHarvestRequests",
                columns: new[] { "BatchID", "RequestID" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BatchHarvestRequests_RequestID",
                table: "BatchHarvestRequests",
                column: "RequestID");

            migrationBuilder.CreateIndex(
                name: "IX_Chemicals_ChemicalName",
                table: "Chemicals",
                column: "ChemicalName");

            migrationBuilder.CreateIndex(
                name: "IX_DurianTrees_FarmID",
                table: "DurianTrees",
                column: "FarmID");

            migrationBuilder.CreateIndex(
                name: "IX_DurianTrees_TreeCode",
                table: "DurianTrees",
                column: "TreeCode");

            migrationBuilder.CreateIndex(
                name: "IX_FarmingLogs_ActivityType",
                table: "FarmingLogs",
                column: "ActivityType");

            migrationBuilder.CreateIndex(
                name: "IX_FarmingLogs_ChemicalID",
                table: "FarmingLogs",
                column: "ChemicalID");

            migrationBuilder.CreateIndex(
                name: "IX_FarmingLogs_LogDate",
                table: "FarmingLogs",
                column: "LogDate");

            migrationBuilder.CreateIndex(
                name: "IX_FarmingLogs_TreeID",
                table: "FarmingLogs",
                column: "TreeID");

            migrationBuilder.CreateIndex(
                name: "IX_Farms_UserID",
                table: "Farms",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_HarvestRequests_ExpectedHarvestDate",
                table: "HarvestRequests",
                column: "ExpectedHarvestDate");

            migrationBuilder.CreateIndex(
                name: "IX_HarvestRequests_RequestCode",
                table: "HarvestRequests",
                column: "RequestCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_HarvestRequests_Status",
                table: "HarvestRequests",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_HarvestRequests_TreeID",
                table: "HarvestRequests",
                column: "TreeID");

            migrationBuilder.CreateIndex(
                name: "IX_HarvestRequests_UserID",
                table: "HarvestRequests",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_ProductBatches_BatchCode",
                table: "ProductBatches",
                column: "BatchCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProductBatches_ExportStatus",
                table: "ProductBatches",
                column: "ExportStatus");

            migrationBuilder.CreateIndex(
                name: "IX_ProductBatches_WarehouseID",
                table: "ProductBatches",
                column: "WarehouseID");

            migrationBuilder.CreateIndex(
                name: "IX_QRCodes_BatchID",
                table: "QRCodes",
                column: "BatchID");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Role",
                table: "Users",
                column: "Role");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Username",
                table: "Users",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Warehouses_ManagerID",
                table: "Warehouses",
                column: "ManagerID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Warehouses_WarehouseName",
                table: "Warehouses",
                column: "WarehouseName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BatchHarvestRequests");

            migrationBuilder.DropTable(
                name: "FarmingLogs");

            migrationBuilder.DropTable(
                name: "QRCodes");

            migrationBuilder.DropTable(
                name: "HarvestRequests");

            migrationBuilder.DropTable(
                name: "Chemicals");

            migrationBuilder.DropTable(
                name: "ProductBatches");

            migrationBuilder.DropTable(
                name: "DurianTrees");

            migrationBuilder.DropTable(
                name: "Warehouses");

            migrationBuilder.DropTable(
                name: "Farms");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
