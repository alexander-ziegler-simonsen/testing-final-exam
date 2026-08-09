using hospitalApi.Services;

namespace hospitalApiTesting;

public class RevokedTokenStoreTests
{
    [Test]
    public void IsRevoked_ForUnknownJti_ReturnsFalse()
    {
        var store = new RevokedTokenStore();

        Assert.That(store.IsRevoked("never-seen"), Is.False);
    }

    [Test]
    public void IsRevoked_AfterRevoke_ReturnsTrue()
    {
        var store = new RevokedTokenStore();

        store.Revoke("jti-1", DateTime.UtcNow.AddMinutes(5));

        Assert.That(store.IsRevoked("jti-1"), Is.True);
    }

    // PurgeExpired only ever runs from inside Revoke() - IsRevoked() never sweeps
    // on its own. So a revoked jti whose expiry has already passed still reports
    // as revoked until some *other* Revoke() call happens to clean it up. That's
    // harmless in practice (JWT lifetime validation rejects the expired token
    // before AuthService even checks IsRevoked), but it's implicit, unverified
    // behavior baked into the sweep strategy - worth pinning down explicitly.
    [Test]
    public void IsRevoked_ForRevokedEntryPastItsExpiry_StillReturnsTrueUntilNextRevokeSweeps()
    {
        var store = new RevokedTokenStore();
        store.Revoke("jti-expired", DateTime.UtcNow.AddMilliseconds(1));

        Thread.Sleep(20);

        Assert.That(store.IsRevoked("jti-expired"), Is.True,
            "IsRevoked doesn't purge on its own - the entry should still be present.");

        // Any other Revoke() call sweeps expired entries as a side effect.
        store.Revoke("jti-other", DateTime.UtcNow.AddMinutes(5));

        Assert.That(store.IsRevoked("jti-expired"), Is.False,
            "The expired entry should have been purged as a side effect of the second Revoke() call.");
    }

    [Test]
    public void Revoke_CalledTwiceForSameJti_RemainsRevoked()
    {
        var store = new RevokedTokenStore();

        store.Revoke("jti-1", DateTime.UtcNow.AddMinutes(5));
        store.Revoke("jti-1", DateTime.UtcNow.AddMinutes(10));

        Assert.That(store.IsRevoked("jti-1"), Is.True);
    }
}
