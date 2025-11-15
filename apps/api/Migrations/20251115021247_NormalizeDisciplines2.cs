using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace GymManagement.Api.Migrations
{
    /// <inheritdoc />
    public partial class NormalizeDisciplines2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "DisciplineId",
                table: "ClassEvents",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Disciplines",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Disciplines", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserDisciplines",
                columns: table => new
                {
                    DisciplineId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserDisciplines", x => new { x.DisciplineId, x.UserId });
                    table.ForeignKey(
                        name: "FK_UserDisciplines_DisciplineId",
                        column: x => x.DisciplineId,
                        principalTable: "Disciplines",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserDisciplines_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Disciplines",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { new Guid("3317ed17-27e0-4257-90c8-c19f62b81dcd"), "Self-defense" },
                    { new Guid("4fe1d315-75f5-489a-aa85-3f3f9eeccdee"), "Taekwondo" },
                    { new Guid("9a641f01-5b10-466c-b2f4-6783782a0ab8"), "Jiu-Jitsu" },
                    { new Guid("aa2a2505-23b8-4738-a5fb-7ac3afc97c44"), "Kick-boxing" },
                    { new Guid("f081556f-a1b9-4438-8925-edd2fec103dd"), "MMA" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ClassEvents_DisciplineId",
                table: "ClassEvents",
                column: "DisciplineId");

            migrationBuilder.CreateIndex(
                name: "IX_UserDisciplines_UserId",
                table: "UserDisciplines",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ClassEvents_Disciplines_DisciplineId",
                table: "ClassEvents",
                column: "DisciplineId",
                principalTable: "Disciplines",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClassEvents_Disciplines_DisciplineId",
                table: "ClassEvents");

            migrationBuilder.DropTable(
                name: "UserDisciplines");

            migrationBuilder.DropTable(
                name: "Disciplines");

            migrationBuilder.DropIndex(
                name: "IX_ClassEvents_DisciplineId",
                table: "ClassEvents");

            migrationBuilder.DropColumn(
                name: "DisciplineId",
                table: "ClassEvents");
        }
    }
}
