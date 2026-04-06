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
        public async Task<IEnumerable<StaffOutput>> GetAll()
        {
            return null;
        }
        public async Task<StaffOutput> GetOne(int id)
        {
            return null;
        }
        public async Task<bool> EditStaff(int StaffId, StaffInput editedStaffData)
        {
            return false;
        }
        public async Task<bool> DeleteStaff(int id)
        {
            return false;
        }
        public async Task<bool> CreateStaff(StaffInput newStaff)
        {
            return false;
        }
    }
}
