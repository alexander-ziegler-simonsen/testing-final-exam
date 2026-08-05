using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;

namespace hospitalApi.Services.Interfaces
{
    public interface IShiftService
    {
        Task<IEnumerable<ShiftOutputDto>> GetAll(DateTime? from = null, DateTime? to = null, string? sortBy = null, string? sortDir = "asc");
        Task<ShiftOutputDto> GetOne(int id);
        Task<bool> EditShift(int ShiftId, ShiftInputDto editedShiftData);
        Task<bool> DeleteShift(int id);
        Task<int> CreateShift(ShiftInputDto newShift);
    }
}
