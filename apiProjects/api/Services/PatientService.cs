using AutoMapper;
using hospitalApi.Data;
using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;
using hospitalApi.Models;
using hospitalApi.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace hospitalApi.Services
{
    public class PatientService : IPatientService
    {

        private DbSet<Patient> _patients;
        private readonly HospitalContext _hospitalContext;
        IMapper _mapper;
        public PatientService(HospitalContext dbContext, IMapper mapper)
        {
            _hospitalContext = dbContext;
            _mapper = mapper;
            _patients = dbContext.Patients;
        }

        public async Task<IEnumerable<PatientOutput>> GetAll()
        {
            var entities = await _patients.ToListAsync();

            return _mapper.Map<List<PatientOutput>>(entities);
        }

        public async Task<PatientOutput> GetOne(int id)
        {
            var entity = await _patients.FirstOrDefaultAsync(p => p.Id == id);

            if (entity == null)
                return null;

            return _mapper.Map<PatientOutput>(entity);
        }

        public async Task<bool> EditPatient(int patientId, PatientInput editedPatientData)
        {
            return false;
        }
        public async Task<bool> DeletePatient(int id)
        {
            return false;
        }
        public async Task<bool> CreatePatient(PatientInput newPatient)
        {
            return false;
        }
    }
}
