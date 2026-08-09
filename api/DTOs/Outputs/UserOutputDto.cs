using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Outputs;

public class UserOutputDto
{
    public int Id { get; set; }
    [StringLength(100, MinimumLength = 2)]
    public string Username { get; set; } = null!;
    public int? FkStaffId { get; set; }
    public int? FkPatientId { get; set; }
}
