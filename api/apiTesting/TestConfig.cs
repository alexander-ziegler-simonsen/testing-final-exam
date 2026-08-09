using Microsoft.Extensions.Configuration;

namespace hospitalApiTesting;

// Mock<IConfiguration> looks like the obvious choice, but AuthService calls the
// GetValue<T>(key) extension method (for Jwt:AccessTokenMinutes / Jwt:RefreshTokenDays),
// which internally calls GetSection() - an un-configured mock returns null for that,
// which throws a NullReferenceException deep inside ConfigurationBinder rather than a
// clear test failure. A real in-memory IConfiguration behaves exactly like appsettings.json
// and avoids that whole class of mocking gotcha.
public static class TestConfig
{
    // Exposed so tests that need to hand-forge a JWT (e.g. signing with the wrong
    // key, or on omitting a claim) can match the values Build() wires up.
    public const string Key = "HospitalApiSuperSecretKey2025!MustBe32Chars+";
    public const string RefreshKey = "HospitalApiSuperSecretRefreshKey2025!MustBe32+";
    public const string Issuer = "hospitalApi";
    public const string Audience = "hospitalFrontend";

    public static IConfiguration Build(Dictionary<string, string?>? overrides = null)
    {
        var values = new Dictionary<string, string?>
        {
            ["Jwt:Key"] = Key,
            ["Jwt:RefreshKey"] = RefreshKey,
            ["Jwt:Issuer"] = Issuer,
            ["Jwt:Audience"] = Audience,
            ["Jwt:AccessTokenMinutes"] = "2",
            ["Jwt:RefreshTokenDays"] = "7",
        };

        if (overrides != null)
        {
            foreach (var (key, value) in overrides)
                values[key] = value;
        }

        return new ConfigurationBuilder().AddInMemoryCollection(values).Build();
    }
}
