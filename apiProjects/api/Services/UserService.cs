using hospitalApi.Data;
using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;
using hospitalApi.Models;
using hospitalApi.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace hospitalApi.Services
{
    public class UserService : IUserService
    {
        private readonly HospitalContext _context;

        public UserService(HospitalContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<UserOutputDto>> GetAll()
        {
            return await _context.Users
                .Select(u => new UserOutputDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    FkStaffId = u.FkStaffId,
                })
                .ToListAsync();
        }

        public async Task<bool> Register(RegisterInputDto input)
        {
            // A user is either a staff login or a patient login, never both/neither
            if ((input.FkStaffId == null) == (input.FkPatientId == null))
                return false;

            // Reject duplicate usernames
            bool exists = await _context.Users.AnyAsync(u => u.Username == input.Username);
            if (exists)
                return false;

            var salt = BCrypt.Net.BCrypt.GenerateSalt();
            var hash = BCrypt.Net.BCrypt.HashPassword(input.Password, salt);

            var user = new User
            {
                Username = input.Username,
                PasswordHash = hash,
                Salt = salt,
                FkStaffId = input.FkStaffId,
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            if (input.FkPatientId.HasValue)
            {
                await _context.UserPatients.AddAsync(new UserPatient
                {
                    FkUserId = user.Id,
                    FkPatientId = input.FkPatientId.Value,
                });
                await _context.SaveChangesAsync();
            }

            return true;
        }

        public async Task<bool> ChangePassword(int id, string newPassword)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
                return false;

            var salt = BCrypt.Net.BCrypt.GenerateSalt();
            user.Salt = salt;
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword, salt);

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Delete(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
                return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
