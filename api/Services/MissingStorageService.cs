using AutoMapper;
using hospitalApi.Data;
using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;
using hospitalApi.Models;
using hospitalApi.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace hospitalApi.Services
{
    public class MissingStorageService : IMissingStorageService
    {
        private DbSet<MedicationStorageMissing> _missing;
        private readonly HospitalContext _hospitalContext;
        IMapper _mapper;
        public MissingStorageService(HospitalContext dbContext, IMapper mapper)
        {
            _hospitalContext = dbContext;
            _mapper = mapper;
            _missing = dbContext.MedicationStorageMissings;
        }
        public async Task<IEnumerable<MedicationStorageMissingOutputDto>> GetAll()
        {
            var entities = await _missing.OrderBy(m => m.Id).ToListAsync();
            return _mapper.Map<IEnumerable<MedicationStorageMissingOutputDto>>(entities);
        }

        public async Task<MedicationStorageMissingOutputDto> GetOne(int id)
        {
            var entity = await _missing.FirstOrDefaultAsync(m => m.Id == id);
            if (entity == null)
                return null;

            return _mapper.Map<MedicationStorageMissingOutputDto>(entity);
        }

        public async Task<bool> EditMissingStorage(int MissingStorageId, MedicationStorageMissingInputDto editedMissingStorageData)
        {
            var entity = await _missing.FirstOrDefaultAsync(m => m.Id == MissingStorageId);
            if (entity == null)
                return false;

            entity.FkMedicationStorageId = editedMissingStorageData.FkMedicationStorageId;
            entity.AmountMissing = editedMissingStorageData.AmountMissing;
            entity.WentMissingAt = editedMissingStorageData.WentMissingAt;

            await _hospitalContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteMissingStorage(int id)
        {
            var entity = await _missing.FirstOrDefaultAsync(m => m.Id == id);
            if (entity == null)
                return false;

            _missing.Remove(entity);
            await _hospitalContext.SaveChangesAsync();
            return true;
        }

        public async Task<int> CreateMissingStorage(MedicationStorageMissingInputDto newMissingStorage)
        {
            var entity = _mapper.Map<MedicationStorageMissing>(newMissingStorage);
            await _missing.AddAsync(entity);
            await _hospitalContext.SaveChangesAsync();
            return entity.Id;
        }
    }
}
