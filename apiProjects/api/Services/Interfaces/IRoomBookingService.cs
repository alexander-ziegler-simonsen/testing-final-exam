using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;

namespace hospitalApi.Services.Interfaces
{
    public interface IRoomBookingService
    {
        Task<IEnumerable<RoomBookingOutput>> GetAll();
        Task<RoomBookingOutput?> GetOne(int id);
        Task<bool> EditRoomBooking(int roomBookingId, RoomBookingInput editedRoomBookingData);
        Task<bool> DeleteRoomBooking(int id);
        Task<bool> CreateRoomBooking(RoomBookingInput newRoomBooking);
    }
}
