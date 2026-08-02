using AutoMapper;
using hospitalApi.Data;
using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;
using hospitalApi.Models;
using hospitalApi.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace hospitalApi.Services
{
    public class StorageService : IStorageService
    {
        private DbSet<MedicationStorage> storages;
        private readonly HospitalContext _hospitalContext;
        IMapper _mapper;
        public StorageService(HospitalContext dbContext, IMapper mapper)
        {
            _hospitalContext = dbContext;
            _mapper = mapper;
            storages = dbContext.MedicationStorages;
        }
        public async Task<IEnumerable<MedicationStorageOutputDto>> GetAll()
        {
            var entities = await storages.ToListAsync();
            return _mapper.Map<IEnumerable<MedicationStorageOutputDto>>(entities);
        }

        public async Task<MedicationStorageOutputDto?> GetOne(int id)
        {
            var entity = await storages.FirstOrDefaultAsync(s => s.Id == id);
            if (entity == null)
                return null;

            return _mapper.Map<MedicationStorageOutputDto>(entity);
        }

        public async Task<bool> EditStorage(int StorageId, MedicationStorageInputDto editedStorageData)
        {
            var entity = await storages.FirstOrDefaultAsync(s => s.Id == StorageId);
            if (entity == null)
                return false;

            entity.FkMedicationId = editedStorageData.FkMedicationId;
            entity.Amount = editedStorageData.Amount;

            await _hospitalContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteStorage(int id)
        {
            var entity = await storages.FirstOrDefaultAsync(s => s.Id == id);
            if (entity == null)
                return false;

            storages.Remove(entity);
            await _hospitalContext.SaveChangesAsync();
            return true;
        }

        public async Task<int> CreateStorage(MedicationStorageInputDto newStorage)
        {
            var entity = _mapper.Map<MedicationStorage>(newStorage);
            await storages.AddAsync(entity);
            await _hospitalContext.SaveChangesAsync();
            return entity.Id;
        }
    }
}
