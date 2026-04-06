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
        public async Task<IEnumerable<MedicationStorageOutput>> GetAll()
        {
            return null;
        }
        public async Task<MedicationStorageOutput> GetOne(int id)
        {
            return null;
        }
        public async Task<bool> EditStorage(int StorageId, MedicationStorageInput editedStorageData)
        {
            return false;
        }
        public async Task<bool> DeleteStorage(int id)
        {
            return false;
        }
        public async Task<bool> CreateStorage(MedicationStorageInput newStorage)
        {
            return false;
        }
    }
}
