namespace hospitalApi.DTOs.Outputs;

public class LoginOutput
{
    public string Token { get; set; } = null!;
    public int StaffId { get; set; }
    public string? Firstname { get; set; }
    public string? Lastname { get; set; }
    public string Role { get; set; } = null!;
}
