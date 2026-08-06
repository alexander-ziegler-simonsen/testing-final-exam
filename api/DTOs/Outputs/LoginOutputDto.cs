using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Outputs;

public class LoginOutputDto
{
    [Required]
    [StringLength(255, ErrorMessage = "Token cannot exceed 255 characters.")]
    [DefaultValue("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwidW5pcXVlX25hbWUiOiJkb2N0b3IifQ.4f2c8b1e7a9d6f3c0b5e8a1d4f7c2b9e6a3d0f5c8b1e4a7d2f9c6b3e0a5d8f1c")]
    public string Token { get; set; } = null!;
    [DefaultValue(2)]
    public int? StaffId { get; set; }
    [DefaultValue(null)]
    public int? PatientId { get; set; }
    [StringLength(100, MinimumLength = 2)]
    [DefaultValue("eva")]
    public string? Firstname { get; set; }
    [StringLength(100, MinimumLength = 2)]
    [DefaultValue("møller")]
    public string? Lastname { get; set; }
    [DefaultValue("doctor")]
    public string Role { get; set; } = null!;
}
