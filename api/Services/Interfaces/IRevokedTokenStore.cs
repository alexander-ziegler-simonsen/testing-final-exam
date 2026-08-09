namespace hospitalApi.Services.Interfaces
{
    public interface IRevokedTokenStore
    {
        void Revoke(string jti, DateTime expiresAtUtc);
        bool IsRevoked(string jti);
    }
}
