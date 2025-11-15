using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GymManagement.Api.Migrations
{
    public partial class RemoveLegacyDisciplineColumns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // drop legacy JSON column on users (safe if already removed)
            migrationBuilder.Sql("ALTER TABLE \"Users\" DROP COLUMN IF EXISTS \"DisciplinesJson\";");

            // drop legacy text discipline on class events (safe if already removed)
            migrationBuilder.Sql("ALTER TABLE \"ClassEvents\" DROP COLUMN IF EXISTS \"Discipline\";");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DisciplinesJson",
                table: "Users",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Discipline",
                table: "ClassEvents",
                type: "text",
                nullable: true);
        }
    }
}
