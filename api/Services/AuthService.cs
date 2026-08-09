using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using hospitalApi.Data;
using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;
using hospitalApi.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace hospitalApi.Services
{
    public class AuthService : IAuthService
    {
        private const string TokenUseClaim = "token_use";
        private const string RefreshTokenUse = "refresh";

        private readonly HospitalContext _context;
        private readonly IConfiguration _configuration;
        private readonly IRevokedTokenStore _revokedTokenStore;

        public AuthService(HospitalContext context, IConfiguration configuration, IRevokedTokenStore revokedTokenStore)
        {
            _context = context;
            _configuration = configuration;
            _revokedTokenStore = revokedTokenStore;
        }

        public async Task<AuthTokens?> Login(LoginInputDto credentials)
        {
            var user = await _context.Users
                .Include(u => u.FkStaff)
                .ThenInclude(s => s!.FkRole)
                .Include(u => u.UserPatient)
                .ThenInclude(up => up!.FkPatient)
                .FirstOrDefaultAsync(u => u.Username == credentials.Username);

            if (user == null)
                return null;

            // Hash the incoming password with the stored salt and compare
            var hashedInput = BCrypt.Net.BCrypt.HashPassword(credentials.Password, user.Salt);

            if (hashedInput != user.PasswordHash)
                return null;

            return BuildAuthTokens(user);
        }

        public async Task<AuthTokens?> Refresh(string rawRefreshToken)
        {
            var principal = ValidateRefreshToken(rawRefreshToken);
            if (principal == null)
                return null;

            var jti = principal.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Jti)?.Value;
            if (jti == null || _revokedTokenStore.IsRevoked(jti))
                return null;

            var subject = principal.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value;
            if (!int.TryParse(subject, out var userId))
                return null;

            var user = await _context.Users
                .Include(u => u.FkStaff)
                .ThenInclude(s => s!.FkRole)
                .Include(u => u.UserPatient)
                .ThenInclude(up => up!.FkPatient)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return null;

            // Rotation: this refresh token has now been used, so it can never be used again,
            // even though it hasn't naturally expired yet.
            RevokeJti(jti, principal);

            return BuildAuthTokens(user);
        }

        public void Logout(string rawRefreshToken)
        {
            var handler = new JwtSecurityTokenHandler();
            if (!handler.CanReadToken(rawRefreshToken))
                return;

            var token = handler.ReadJwtToken(rawRefreshToken);
            var jti = token.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Jti)?.Value;
            if (jti == null)
                return;

            _revokedTokenStore.Revoke(jti, token.ValidTo);
        }

        private AuthTokens BuildAuthTokens(Models.User user)
        {
            // A user is either linked to a staff record (role comes from staff_role)
            // or linked to a patient record via user_patient (role is always "patient")
            var output = new LoginOutputDto
            {
                StaffId = user.FkStaff?.Id,
                Firstname = user.FkStaff?.Firstname ?? user.UserPatient?.FkPatient.Firstname,
                Lastname = user.FkStaff?.Lastname ?? user.UserPatient?.FkPatient.Lastname,
                Role = user.FkStaff?.FkRole.Name ?? "patient",
                PatientId = user.UserPatient?.FkPatientId,
                Token = GenerateAccessToken(user),
            };

            return new AuthTokens(output, GenerateRefreshToken(user));
        }

        private string GenerateAccessToken(Models.User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var role = user.FkStaff?.FkRole.Name ?? "patient";
            var identityId = user.FkStaff?.Id ?? user.UserPatient?.FkPatientId;

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, identityId.ToString() ?? ""),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, role)
            };

            var minutes = _configuration.GetValue<int?>("Jwt:AccessTokenMinutes") ?? 2;

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(minutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // Signed with its own secret (Jwt:RefreshKey) so a leaked access-token key alone
        // can never be used to mint a refresh token, and vice versa.
        private string GenerateRefreshToken(Models.User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:RefreshKey"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(TokenUseClaim, RefreshTokenUse)
            };

            var days = _configuration.GetValue<int?>("Jwt:RefreshTokenDays") ?? 7;

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(days),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private ClaimsPrincipal? ValidateRefreshToken(string rawRefreshToken)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:RefreshKey"]!));
            var parameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = _configuration["Jwt:Issuer"],
                ValidAudience = _configuration["Jwt:Audience"],
                IssuerSigningKey = key,
                ClockSkew = TimeSpan.Zero
            };

            // MapInboundClaims = false so the claims come back exactly as authored
            // ("sub"/"jti"/"token_use"), not remapped to long ClaimTypes URIs.
            var handler = new JwtSecurityTokenHandler { MapInboundClaims = false };

            try
            {
                var principal = handler.ValidateToken(rawRefreshToken, parameters, out _);
                var tokenUse = principal.Claims.FirstOrDefault(c => c.Type == TokenUseClaim)?.Value;
                return tokenUse == RefreshTokenUse ? principal : null;
            }
            catch (SecurityTokenException)
            {
                return null;
            }
        }

        private void RevokeJti(string jti, ClaimsPrincipal principal)
        {
            var expClaim = principal.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Exp)?.Value;
            var expiresAtUtc = long.TryParse(expClaim, out var expUnix)
                ? DateTimeOffset.FromUnixTimeSeconds(expUnix).UtcDateTime
                : DateTime.UtcNow.AddDays(7);

            _revokedTokenStore.Revoke(jti, expiresAtUtc);
        }
    }
}
