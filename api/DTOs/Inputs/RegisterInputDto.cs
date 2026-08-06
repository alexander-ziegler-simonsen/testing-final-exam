using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Inputs;

public class RegisterInputDto
{
    [StringLength(100, MinimumLength = 2)]
    [DefaultValue("doctor")]
    public string Username { get; set; } = null!;
    [StringLength(40, MinimumLength = 8)]
    [DefaultValue("Doctor1234!")]
    public string Password { get; set; } = null!;
    [DefaultValue(3)]
    public int? FkStaffId { get; set; }
    [DefaultValue(null)]
    public int? FkPatientId { get; set; }
}
