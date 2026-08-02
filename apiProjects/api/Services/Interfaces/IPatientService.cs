using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;

namespace hospitalApi.Services.Interfaces
{
    public interface IPatientService
    {
        Task<IEnumerable<PatientOutputDto>> GetAll(PatientInputDto? filter = null, string? sortBy = null, string? sortDir = "asc");
        Task<PatientOutputDto?> GetOne(int id);
        Task<bool> EditPatient(int patientId, PatientInputDto editedPatientData);
        Task<bool> DeletePatient(int id);
        Task<int> CreatePatient(PatientInputDto newPatient);


    }
}
