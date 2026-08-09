using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Outputs;

public class LoginOutputDto
{
    [Required]
    [StringLength(255, ErrorMessage = "Token cannot exceed 255 characters.")]
    public string Token { get; set; } = null!;
    public int? StaffId { get; set; }
    public int? PatientId { get; set; }
    [StringLength(100, MinimumLength = 2)]
    public string? Firstname { get; set; }
    [StringLength(100, MinimumLength = 2)]
    public string? Lastname { get; set; }
    public string Role { get; set; } = null!;
}
