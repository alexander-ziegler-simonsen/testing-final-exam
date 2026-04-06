using AutoMapper;
using hospitalApi.Data;
using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;
using hospitalApi.Models;
using hospitalApi.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace hospitalApi.Services
{
    public class ShiftService : IShiftService
    {
        private DbSet<Shift> shifts;
        private readonly HospitalContext _hospitalContext;
        IMapper _mapper;
        public ShiftService(HospitalContext dbContext, IMapper mapper)
        {
            _hospitalContext = dbContext;
            _mapper = mapper;
            shifts = dbContext.Shifts;
        }

        public async Task<IEnumerable<ShiftOutput>> GetAll()
        {
            return null;
        }
        public async Task<ShiftOutput> GetOne(int id)
        {
            return null;
        }
        public async Task<bool> EditShift(int ShiftId, ShiftInput editedShiftData)
        {
            return false;
        }
        public async Task<bool> DeleteShift(int id)
        {
            return false;
        }
        public async Task<bool> CreateShift(ShiftInput newShift)
        {
            return false;
        }
    }
}
