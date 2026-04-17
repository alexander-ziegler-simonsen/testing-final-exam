using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;

namespace hospitalApi.Services.Interfaces
{
    public interface IShiftService
    {
        Task<IEnumerable<ShiftOutput>> GetAll(DateTime? from = null, DateTime? to = null, string? sortBy = null, string? sortDir = "asc");
        Task<ShiftOutput> GetOne(int id);
        Task<bool> EditShift(int ShiftId, ShiftInput editedShiftData);
        Task<bool> DeleteShift(int id);
        Task<bool> CreateShift(ShiftInput newShift);
    }
}
