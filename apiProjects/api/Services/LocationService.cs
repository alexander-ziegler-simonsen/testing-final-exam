using hospitalApi.Data;
using hospitalApi.DTOs.Outputs;
using hospitalApi.Models;
using hospitalApi.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace hospitalApi.Services
{
    public class LocationService : ILocationService
    {
        private DbSet<Floor> _floors;
        private DbSet<Room> _rooms;
        private DbSet<Building> _buildings;

        private HospitalContext _hospitalContext;

        public LocationService(HospitalContext dbContext)
        {
            _hospitalContext = dbContext;
            _floors = dbContext.Floors;
            _rooms = dbContext.Rooms;
            _buildings = dbContext.Buildings;
        }

        public async Task<List<LocationOutput>> getAllLocations()
        {
            var raw = await _buildings
            .Include(b => b.Floors)
                .ThenInclude(f => f.Rooms)
            .ToListAsync();

            List<LocationOutput> outputs = new List<LocationOutput>();

            foreach (var building in raw)
            {
                // map the base and insert building info
                var location = new LocationOutput
                {
                    Building = new BuildingOutput
                    {
                        Id = building.Id,
                        Address = building.Address,
                        Name = building.Name
                    },
                    FloorsWithRoomns = new List<FloorRoomsOutput>()
                };

                // step 2 is each floor, than have many rooms
                foreach (var floor in building.Floors ?? new List<Floor>())
                {
                    List<RoomOutput> roomOutputs = new();
                    var floorOutput = new FloorRoomsOutput
                    {
                        Floor = new FloorOutput
                        {
                            Id = floor.Id,
                            FkBuildingId = floor.FkBuildingId,
                            Name = floor.Name,
                        },
                        Rooms = roomOutputs
                    };

                    // now we handle each room
                    foreach (var room in floor.Rooms ?? new List<Room>())
                    {
                        floorOutput.Rooms.Add(new RoomOutput
                        {
                            Id = room.Id,
                            FkFloorId = room.FkFloorId,
                            Name = room.Name
                        });
                    }

                    location.FloorsWithRoomns.Add(floorOutput);
                }

                outputs.Add(location);
            }

            return outputs;
        }
        public async Task<LocationOutput> getOneLocations(int buildingId)
        {
            // var raw = await
            return null;
        }
        public async Task<List<FloorRoomsOutput>> getOneAllFloors()
        {
            // var raw = await
            return null;
        }
        public async Task<FloorRoomsOutput> getOneFloorWithRooms(int floorId)
        {
            // var raw = await
            return null;
        }
    }
}
