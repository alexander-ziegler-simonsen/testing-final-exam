using hospitalApi.DTOs.Outputs;

namespace hospitalApi.Services.Interfaces
{
    public interface ILocationService
    {
        Task<List<LocationOutput>> getAllLocations();
        Task<LocationOutput> getOneLocations(int buildingId);

        Task<List<FloorRoomsOutput>> getOneAllFloors();
        Task<FloorRoomsOutput> getOneFloorWithRooms(int floorId);
    }
}
