using System.Collections.Concurrent;
using hospitalApi.Services.Interfaces;

namespace hospitalApi.Services
{
    // In-memory only, by design: revocations are never persisted to the database.
    // A process restart forgets them, at which point revoked-but-unexpired refresh
    // tokens simply fall back to being valid again until their own expiry.
    public class RevokedTokenStore : IRevokedTokenStore
    {
        private readonly ConcurrentDictionary<string, DateTime> _revoked = new();

        public void Revoke(string jti, DateTime expiresAtUtc)
        {
            _revoked[jti] = expiresAtUtc;
            PurgeExpired();
        }

        public bool IsRevoked(string jti)
        {
            return _revoked.ContainsKey(jti);
        }

        private void PurgeExpired()
        {
            var now = DateTime.UtcNow;
            foreach (var (jti, expiresAtUtc) in _revoked)
            {
                if (expiresAtUtc <= now)
                    _revoked.TryRemove(jti, out _);
            }
        }
    }
}
