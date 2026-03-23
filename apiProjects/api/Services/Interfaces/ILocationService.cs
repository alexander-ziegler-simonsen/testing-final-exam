using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;

namespace hospitalApi.Services.Interfaces
{
    public interface ILocationService
    {
        Task<List<LocationOutput>> getAllLocations();
        Task<LocationOutput> getOneLocations(int buildingId);

        Task<List<FloorRoomsOutput>> getOneAllFloors();
        Task<FloorRoomsOutput> getOneFloorWithRooms(int floorId);


        Task<bool> EditOnefloor(int id, FloorInput input);
        Task<int> PostOneFloor(FloorInput input);
        Task<bool> DeleteOneFloor(int id);
    }
}
