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

        public async Task<IEnumerable<ShiftOutput>> GetAll(DateTime? from = null, DateTime? to = null, string? sortBy = null, string? sortDir = "asc")
        {
            IQueryable<Shift> query = shifts;

            // Date range filter: shifts that overlap with [from, to]
            if (from.HasValue)
                query = query.Where(s => s.EndTime >= from.Value);
            if (to.HasValue)
                query = query.Where(s => s.StartTime <= to.Value);

            bool desc = sortDir?.ToLower() == "desc";
            query = sortBy?.ToLower() switch
            {
                "starttime" => desc ? query.OrderByDescending(s => s.StartTime) : query.OrderBy(s => s.StartTime),
                "endtime"   => desc ? query.OrderByDescending(s => s.EndTime)   : query.OrderBy(s => s.EndTime),
                _           => desc ? query.OrderByDescending(s => s.Id)        : query.OrderBy(s => s.Id),
            };

            var entities = await query.ToListAsync();
            return _mapper.Map<IEnumerable<ShiftOutput>>(entities);
        }

        public async Task<ShiftOutput> GetOne(int id)
        {
            var entity = await shifts.FirstOrDefaultAsync(s => s.Id == id);
            if (entity == null)
                return null;

            return _mapper.Map<ShiftOutput>(entity);
        }

        public async Task<bool> EditShift(int ShiftId, ShiftInput editedShiftData)
        {
            var entity = await shifts.FirstOrDefaultAsync(s => s.Id == ShiftId);
            if (entity == null)
                return false;

            entity.StartTime = editedShiftData.StartTime;
            entity.EndTime = editedShiftData.EndTime;

            await _hospitalContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteShift(int id)
        {
            var entity = await shifts.FirstOrDefaultAsync(s => s.Id == id);
            if (entity == null)
                return false;

            shifts.Remove(entity);
            await _hospitalContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CreateShift(ShiftInput newShift)
        {
            var entity = _mapper.Map<Shift>(newShift);
            await shifts.AddAsync(entity);
            await _hospitalContext.SaveChangesAsync();
            return true;
        }
    }
}
