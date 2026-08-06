using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;

namespace hospitalApi.Services.Interfaces
{
    public interface IPrescriptionService
    {
        Task<IEnumerable<PrescriptionOutputDto>> GetAll();
        Task<PrescriptionOutputDto> GetOne(int id);
        Task<bool> EditPrescription(int PrescriptionId, PrescriptionInputDto editedPrescriptionData);
        Task<bool> DeletePrescription(int id);
        Task<int> CreatePrescription(PrescriptionInputDto newPrescription);
    }
}
