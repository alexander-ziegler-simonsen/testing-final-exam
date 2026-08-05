using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
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
        private readonly IMapper _mapper;

        public AuthService(HospitalContext context, IConfiguration configuration, IMapper mapper)
        {
            _context = context;
            _configuration = configuration;
            _mapper = mapper;
        }

        public async Task<LoginOutputDto?> Login(LoginInputDto credentials)
        {
            var user = await _context.Users
                .Include(u => u.FkStaff)
                .ThenInclude(s => s.FkRole)
                .FirstOrDefaultAsync(u => u.Username == credentials.Username);

            if (user == null)
                return null;

            // Hash the incoming password with the stored salt and compare
            var hashedInput = BCrypt.Net.BCrypt.HashPassword(credentials.Password, user.Salt);

            if (hashedInput != user.PasswordHash)
                return null;

            var output = _mapper.Map<LoginOutputDto>(user);
            output.Token = GenerateToken(user);

            return output;
        }

        private string GenerateToken(Models.User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.FkStaff.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.FkStaff.FkRole.Name)
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
