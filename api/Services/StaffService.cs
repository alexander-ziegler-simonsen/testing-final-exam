using AutoMapper;
using hospitalApi.Data;
using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;
using hospitalApi.Models;
using hospitalApi.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace hospitalApi.Services
{
    public class StaffService : IStaffService
    {
        private DbSet<Staff> staffs;
        private readonly HospitalContext _hospitalContext;
        IMapper _mapper;
        public StaffService(HospitalContext dbContext, IMapper mapper)
        {
            _hospitalContext = dbContext;
            _mapper = mapper;
            staffs = dbContext.Staff;
        }
        public async Task<IEnumerable<StaffOutputDto>> GetAll()
        {
            var entities = await staffs.OrderBy(s => s.Id).ToListAsync();
            return _mapper.Map<List<StaffOutputDto>>(entities);
        }

        public async Task<StaffOutputDto?> GetOne(int id)
        {
            var entity = await staffs.FirstOrDefaultAsync(s => s.Id == id);

            if (entity == null)
                return null;

            return _mapper.Map<StaffOutputDto>(entity);
        }

        public async Task<int> GetStaffCount()
        {
            return await staffs.CountAsync();
        }

        public async Task<bool> EditStaff(int StaffId, StaffInputDto editedStaffData)
        {
            var entity = await staffs.FirstOrDefaultAsync(s => s.Id == StaffId);

            if (entity == null)
                return false;

            entity.Firstname = editedStaffData.Firstname;
            entity.Lastname = editedStaffData.Lastname;
            entity.FkRoleId = editedStaffData.FkRoleId;

            await _hospitalContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteStaff(int id)
        {
            var entity = await staffs.FirstOrDefaultAsync(s => s.Id == id);

            if (entity == null)
                return false;

            staffs.Remove(entity);
            await _hospitalContext.SaveChangesAsync();
            return true;
        }

        public async Task<int> CreateStaff(StaffInputDto newStaff)
        {
            var entity = new Staff
            {
                Firstname = newStaff.Firstname,
                Lastname = newStaff.Lastname,
                FkRoleId = newStaff.FkRoleId
            };
            await staffs.AddAsync(entity);
            await _hospitalContext.SaveChangesAsync();
            return entity.Id;
        }
    }
}
