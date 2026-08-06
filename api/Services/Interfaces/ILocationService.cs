using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;

namespace hospitalApi.Services.Interfaces
{
    public interface ILocationService
    {
        Task<List<LocationOutputDto>> getAllLocations();
        Task<LocationOutputDto> getOneLocations(int buildingId);

        Task<List<FloorRoomsOutputDto>> getOneAllFloors();
        Task<FloorRoomsOutputDto> getOneFloorWithRooms(int floorId);


        Task<bool> EditOnefloor(int id, FloorInputDto input);
        Task<int> PostOneFloor(FloorInputDto input);
        Task<bool> DeleteOneFloor(int id);
    }
}
