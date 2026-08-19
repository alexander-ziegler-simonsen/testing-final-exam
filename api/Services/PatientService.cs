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

        public async Task<IEnumerable<PatientOutputDto>> GetAll(PatientInputDto? filter = null, string? sortBy = null, string? sortDir = "asc")
        {
            IQueryable<Patient> query = _patients;

            if (filter != null)
            {
                if (!string.IsNullOrWhiteSpace(filter.Firstname))
                    query = query.Where(p => p.Firstname != null && p.Firstname.ToLower().Contains(filter.Firstname.ToLower()));
                if (!string.IsNullOrWhiteSpace(filter.Lastname))
                    query = query.Where(p => p.Lastname != null && p.Lastname.ToLower().Contains(filter.Lastname.ToLower()));
                if (!string.IsNullOrWhiteSpace(filter.Gender))
                    query = query.Where(p => p.Gender != null && p.Gender.ToLower().Contains(filter.Gender.ToLower()));
                if (!string.IsNullOrWhiteSpace(filter.CprNumber))
                    query = query.Where(p => p.CprNumber != null && p.CprNumber.ToLower().Contains(filter.CprNumber.ToLower()));
            }

            bool desc = sortDir?.ToLower() == "desc";
            query = sortBy?.ToLower() switch
            {
                "firstname" => desc ? query.OrderByDescending(p => p.Firstname) : query.OrderBy(p => p.Firstname),
                "lastname" => desc ? query.OrderByDescending(p => p.Lastname) : query.OrderBy(p => p.Lastname),
                "gender" => desc ? query.OrderByDescending(p => p.Gender) : query.OrderBy(p => p.Gender),
                "cprnumber" => desc ? query.OrderByDescending(p => p.CprNumber) : query.OrderBy(p => p.CprNumber),
                _ => desc ? query.OrderByDescending(p => p.Id) : query.OrderBy(p => p.Id),
            };

            var entities = await query.ToListAsync();
            return _mapper.Map<List<PatientOutputDto>>(entities);
        }

        public async Task<int> GetPaitentCount()
        {
            return await _patients.CountAsync();
        }

        public async Task<PatientOutputDto?> GetOne(int id)
        {
            var entity = await _patients.FirstOrDefaultAsync(p => p.Id == id);

            if (entity == null)
                return null;

            return _mapper.Map<PatientOutputDto>(entity);
        }

        public async Task<bool> EditPatient(int patientId, PatientInputDto editedPatientData)
        {
            var entity = await _patients.FirstOrDefaultAsync(p => p.Id == patientId);

            if (entity == null)
                return false;

            entity.Firstname = editedPatientData.Firstname;
            entity.Lastname = editedPatientData.Lastname;
            entity.Gender = editedPatientData.Gender;
            entity.CprNumber = editedPatientData.CprNumber;
            entity.DateOfBirth = editedPatientData.DateOfBirth;
            entity.WeightKg = editedPatientData.WeightKg;
            entity.HeightCm = editedPatientData.HeightCm;

            await _hospitalContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeletePatient(int id)
        {
            var entity = await _patients.FirstOrDefaultAsync(p => p.Id == id);

            if (entity == null)
                return false;

            _patients.Remove(entity);
            await _hospitalContext.SaveChangesAsync();
            return true;
        }

        public async Task<int> CreatePatient(PatientInputDto newPatient)
        {
            var entity = new Patient
            {
                Firstname = newPatient.Firstname,
                Lastname = newPatient.Lastname,
                Gender = newPatient.Gender,
                CprNumber = newPatient.CprNumber,
                DateOfBirth = newPatient.DateOfBirth,
                WeightKg = newPatient.WeightKg,
                HeightCm = newPatient.HeightCm
            };
            await _patients.AddAsync(entity);
            await _hospitalContext.SaveChangesAsync();
            return entity.Id;
        }
    }
}
