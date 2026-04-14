using AutoMapper;
using hospitalApi.Data;
using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;
using hospitalApi.Models;
using hospitalApi.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace hospitalApi.Services
{
    public class MedicinService : IMedicinService
    {
        private DbSet<Medication> _medication;
        private readonly HospitalContext _hospitalContext;
        IMapper _mapper;
        public MedicinService(HospitalContext dbContext, IMapper mapper)
        {
            _hospitalContext = dbContext;
            _mapper = mapper;
            _medication = dbContext.Medications;
        }
        public async Task<IEnumerable<MedicationOutput>> GetAll()
        {
            var entities = await _medication.ToListAsync();
            return _mapper.Map<IEnumerable<MedicationOutput>>(entities);
        }

        public async Task<MedicationOutput> GetOne(int id)
        {
            var entity = await _medication.FirstOrDefaultAsync(m => m.Id == id);
            if (entity == null)
                return null;

            return _mapper.Map<MedicationOutput>(entity);
        }

        public async Task<bool> EditMedication(int MedicationId, MedicationInput editedMedicationData)
        {
            var entity = await _medication.FirstOrDefaultAsync(m => m.Id == MedicationId);
            if (entity == null)
                return false;

            entity.Name = editedMedicationData.Name;
            entity.GenericName = editedMedicationData.GenericName;
            entity.Brand = editedMedicationData.Brand;
            entity.Form = editedMedicationData.Form;
            entity.Strength = editedMedicationData.Strength;
            entity.Category = editedMedicationData.Category;
            entity.Description = editedMedicationData.Description;

            await _hospitalContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteMedication(int id)
        {
            var entity = await _medication.FirstOrDefaultAsync(m => m.Id == id);
            if (entity == null)
                return false;

            _medication.Remove(entity);
            await _hospitalContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CreateMedication(MedicationInput newMedication)
        {
            var entity = _mapper.Map<Medication>(newMedication);
            await _medication.AddAsync(entity);
            await _hospitalContext.SaveChangesAsync();
            return true;
        }
    }
}
