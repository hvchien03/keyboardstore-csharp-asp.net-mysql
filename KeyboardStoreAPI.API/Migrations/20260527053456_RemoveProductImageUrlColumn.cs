using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KeyboardStoreAPI.API.Migrations
{
    /// <inheritdoc />
    public partial class RemoveProductImageUrlColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                "SET @columnExists = (" +
                "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS " +
                "WHERE TABLE_SCHEMA = DATABASE() " +
                "AND TABLE_NAME = 'Products' " +
                "AND COLUMN_NAME = 'ImageUrl');");

            migrationBuilder.Sql(
                "SET @dropSql = IF(@columnExists > 0, " +
                "'ALTER TABLE Products DROP COLUMN ImageUrl', " +
                "'SELECT 1');");

            migrationBuilder.Sql("PREPARE stmt FROM @dropSql;");
            migrationBuilder.Sql("EXECUTE stmt;");
            migrationBuilder.Sql("DEALLOCATE PREPARE stmt;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                "SET @columnExists = (" +
                "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS " +
                "WHERE TABLE_SCHEMA = DATABASE() " +
                "AND TABLE_NAME = 'Products' " +
                "AND COLUMN_NAME = 'ImageUrl');");

            migrationBuilder.Sql(
                "SET @addSql = IF(@columnExists = 0, " +
                "'ALTER TABLE Products ADD ImageUrl longtext NULL', " +
                "'SELECT 1');");

            migrationBuilder.Sql("PREPARE stmt FROM @addSql;");
            migrationBuilder.Sql("EXECUTE stmt;");
            migrationBuilder.Sql("DEALLOCATE PREPARE stmt;");
        }
    }
}
