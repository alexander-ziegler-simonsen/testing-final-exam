using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Outputs;

public class UserOutput
{
    public int Id { get; set; }
    [StringLength(100, MinimumLength = 2)]
    public string Username { get; set; } = null!;
    public int FkStaffId { get; set; }
}
