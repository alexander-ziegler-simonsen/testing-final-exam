namespace hospitalApi.Services.Interfaces
{
    public interface ICprService
    {
        string GenerateCprNumber(DateOnly birthDate, string gender);
        bool IsValid(string? cprNumber);
    }
}
