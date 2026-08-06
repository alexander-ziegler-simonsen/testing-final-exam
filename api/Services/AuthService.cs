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
        private readonly HospitalContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(HospitalContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<LoginOutputDto?> Login(LoginInputDto credentials)
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

            // A user is either linked to a staff record (role comes from staff_role)
            // or linked to a patient record via user_patient (role is always "patient")
            var output = new LoginOutputDto
            {
                StaffId = user.FkStaff?.Id,
                Firstname = user.FkStaff?.Firstname ?? user.UserPatient?.FkPatient.Firstname,
                Lastname = user.FkStaff?.Lastname ?? user.UserPatient?.FkPatient.Lastname,
                Role = user.FkStaff?.FkRole.Name ?? "patient",
                PatientId = user.UserPatient?.FkPatientId,
            };
            output.Token = GenerateToken(user);

            return output;
        }

        private string GenerateToken(Models.User user)
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

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
