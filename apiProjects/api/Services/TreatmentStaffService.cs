using AutoMapper;
using hospitalApi.Data;
using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;
using hospitalApi.Models;
using hospitalApi.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace hospitalApi.Services
{
    public class TreatmentStaffService : ITreatmentStaffService
    {
        private DbSet<TreatmentStaff> treatmentStaffs;
        private readonly HospitalContext _hospitalContext;
        IMapper _mapper;

        public TreatmentStaffService(HospitalContext dbContext, IMapper mapper)
        {
            _hospitalContext = dbContext;
            _mapper = mapper;
            treatmentStaffs = dbContext.TreatmentStaffs;
        }

        public async Task<IEnumerable<TreatmentStaffOutput>> GetAll()
        {
            var entities = await treatmentStaffs.ToListAsync();
            return _mapper.Map<IEnumerable<TreatmentStaffOutput>>(entities);
        }

        public async Task<TreatmentStaffOutput> GetOne(int id)
        {
            var entity = await treatmentStaffs.FirstOrDefaultAsync(ts => ts.Id == id);
            if (entity == null)
                return null;

            return _mapper.Map<TreatmentStaffOutput>(entity);
        }

        public async Task<int> CreateTreatmentStaff(TreatmentStaffInput input)
        {
            var entity = _mapper.Map<TreatmentStaff>(input);
            await treatmentStaffs.AddAsync(entity);
            await _hospitalContext.SaveChangesAsync();
            return entity.Id;
        }

        public async Task<bool> EditTreatmentStaff(int id, TreatmentStaffInput input)
        {
            var entity = await treatmentStaffs.FirstOrDefaultAsync(ts => ts.Id == id);
            if (entity == null)
                return false;

            entity.FkTreatmentId = input.FkTreatmentId;
            entity.FkStaffId = input.FkStaffId;

            await _hospitalContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteTreatmentStaff(int id)
        {
            var entity = await treatmentStaffs.FirstOrDefaultAsync(ts => ts.Id == id);
            if (entity == null)
                return false;

            treatmentStaffs.Remove(entity);
            await _hospitalContext.SaveChangesAsync();
            return true;
        }
    }
}
