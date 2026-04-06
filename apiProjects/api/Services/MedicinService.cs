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
            return null;
        }
        public async Task<MedicationOutput> GetOne(int id)
        {
            return null;
        }
        public async Task<bool> EditMedication(int MedicationId, MedicationInput editedMedicationData)
        {
            return false;
        }
        public async Task<bool> DeleteMedication(int id)
        {
            return false;
        }
        public async Task<bool> CreateMedication(MedicationInput newMedication)
        {
            return false;
        }
    }
}
