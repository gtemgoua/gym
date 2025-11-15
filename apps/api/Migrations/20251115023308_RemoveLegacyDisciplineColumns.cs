using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GymManagement.Api.Migrations
{
    /// <inheritdoc />
    public partial class RemoveLegacyDisciplineColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DisciplinesJson",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Discipline",
                table: "ClassEvents");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DisciplinesJson",
                table: "Users",
                using Microsoft.EntityFrameworkCore.Migrations;

                #nullable disable

                namespace GymManagement.Api.Migrations
                {
                    // Disabled duplicate migration placeholder to avoid duplicate type definitions
                    public partial class RemoveLegacyDisciplineColumns_DisabledDup : Migration
                    {
                        protected override void Up(MigrationBuilder migrationBuilder) { }
                        protected override void Down(MigrationBuilder migrationBuilder) { }
                    }
                }
