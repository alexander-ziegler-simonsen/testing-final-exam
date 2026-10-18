namespace hospitalApi.Services.Interfaces
{
    public interface ICprService
    {
        Task<string> GenerateCprNumber(DateOnly birthDate, string gender);
    }
}
