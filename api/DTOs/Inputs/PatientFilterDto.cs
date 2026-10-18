namespace hospitalApi.DTOs.Inputs;

// query filter for GET /api/Patient - every field is optional, unlike PatientInputDto
public class PatientFilterDto
{
    public string? Firstname { get; set; }
    public string? Lastname { get; set; }
    public string? Gender { get; set; }
    public string? CprNumber { get; set; }
}
