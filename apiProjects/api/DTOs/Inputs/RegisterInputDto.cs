using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Inputs;

public class RegisterInputDto
{
    [StringLength(100, MinimumLength = 2)]
    public string Username { get; set; } = null!;
    [StringLength(40, MinimumLength = 8)]
    public string Password { get; set; } = null!;
    public int FkStaffId { get; set; }
}
