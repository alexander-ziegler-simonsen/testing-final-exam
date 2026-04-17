using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;

namespace hospitalApi.Services.Interfaces
{
    public interface IPatientService
    {
        Task<IEnumerable<PatientOutput>> GetAll(PatientInput? filter = null, string? sortBy = null, string? sortDir = "asc");
        Task<PatientOutput?> GetOne(int id);
        Task<bool> EditPatient(int patientId,PatientInput editedPatientData);
        Task<bool> DeletePatient(int id);
        Task<bool> CreatePatient(PatientInput newPatient);
        
        
    }
}
