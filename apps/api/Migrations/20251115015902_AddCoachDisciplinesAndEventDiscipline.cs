using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GymManagement.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddCoachDisciplinesAndEventDiscipline : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.CreateTable(
                name: "MemberInvites",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Token = table.Column<string>(type: "text", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Accepted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MemberInvites", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MemberInvites_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MemberInvites_UserId",
                table: "MemberInvites",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MemberInvites");

            migrationBuilder.DropColumn(
                name: "DisciplinesJson",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Discipline",
                table: "ClassEvents");
        }
    }
}
