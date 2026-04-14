using AutoMapper;
using hospitalApi.Data;
using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;
using hospitalApi.Models;
using hospitalApi.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace hospitalApi.Services
{
    public class TreatmentService : ITreatmentService
    {
        private DbSet<Treatment> treatments;
        private readonly HospitalContext _hospitalContext;
        IMapper _mapper;
        public TreatmentService(HospitalContext dbContext, IMapper mapper)
        {
            _hospitalContext = dbContext;
            _mapper = mapper;
            treatments = dbContext.Treatments;
        }
        public async Task<IEnumerable<TreatmentOutput>> GetAll()
        {
            var entities = await treatments.ToListAsync();
            return _mapper.Map<IEnumerable<TreatmentOutput>>(entities);
        }

        public async Task<TreatmentOutput> GetOne(int id)
        {
            var entity = await treatments.FirstOrDefaultAsync(t => t.Id == id);
            if (entity == null)
                return null;

            return _mapper.Map<TreatmentOutput>(entity);
        }

        public async Task<bool> EditTreatment(int TreatmentId, TreatmentInput editedTreatmentData)
        {
            var entity = await treatments.FirstOrDefaultAsync(t => t.Id == TreatmentId);
            if (entity == null)
                return false;

            entity.FkPatientId = editedTreatmentData.FkPatientId;
            entity.Description = editedTreatmentData.Description;
            entity.Time = editedTreatmentData.Time;

            await _hospitalContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteTreatment(int id)
        {
            var entity = await treatments.FirstOrDefaultAsync(t => t.Id == id);
            if (entity == null)
                return false;

            treatments.Remove(entity);
            await _hospitalContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CreateTreatment(TreatmentInput newTreatment)
        {
            var entity = _mapper.Map<Treatment>(newTreatment);
            await treatments.AddAsync(entity);
            await _hospitalContext.SaveChangesAsync();
            return true;
        }
    }
}
