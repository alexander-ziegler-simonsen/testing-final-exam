using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;

namespace hospitalApi.Services.Interfaces
{
    public interface IPrescriptionService
    {
        Task<IEnumerable<PrescriptionOutput>> GetAll();
        Task<PrescriptionOutput> GetOne(int id);
        Task<bool> EditPrescription(int PrescriptionId, PrescriptionInput editedPrescriptionData);
        Task<bool> DeletePrescription(int id);
        Task<int> CreatePrescription(PrescriptionInput newPrescription);
    }
}
