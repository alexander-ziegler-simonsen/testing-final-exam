using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Outputs;

public class UserOutputDto
{
    [DefaultValue(2)]
    public int Id { get; set; }
    [StringLength(100, MinimumLength = 2)]
    [DefaultValue("doctor")]
    public string Username { get; set; } = null!;
    [DefaultValue(2)]
    public int? FkStaffId { get; set; }
    [DefaultValue(null)]
    public int? FkPatientId { get; set; }
}
