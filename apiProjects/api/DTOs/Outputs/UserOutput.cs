namespace hospitalApi.DTOs.Outputs;

public class UserOutput
{
    public int Id { get; set; }
    public string Username { get; set; } = null!;
    public int FkStaffId { get; set; }
}
