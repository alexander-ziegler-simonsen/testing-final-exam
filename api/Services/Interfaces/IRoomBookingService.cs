using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;

namespace hospitalApi.Services.Interfaces
{
    public interface IRoomBookingService
    {
        Task<IEnumerable<RoomBookingOutputDto>> GetAll();
        Task<RoomBookingOutputDto?> GetOne(int id);
        Task<bool> EditRoomBooking(int roomBookingId, RoomBookingInputDto editedRoomBookingData);
        Task<bool> DeleteRoomBooking(int id);
        Task<int> CreateRoomBooking(RoomBookingInputDto newRoomBooking);
        Task<bool> IsRoomAvailable(int roomId, DateTime start, DateTime end, int? excludeBookingId = null);
    }
}
