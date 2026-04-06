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
        public async Task<IEnumerable<MedicationStorageMissingOutput>> GetAll()
        {
            return null;
        }
        public async Task<MedicationStorageMissingOutput> GetOne(int id)
        {
            return null;
        }
        public async Task<bool> EditMissingStorage(int MissingStorageId, MedicationStorageMissingInput editedMissingStorageData)
        {
            return false;
        }
        public async Task<bool> DeleteMissingStorage(int id)
        {
            return false;
        }
        public async Task<bool> CreateMissingStorage(MedicationStorageMissingInput newMissingStorage)
        {
            return false;
        }
    }
}
