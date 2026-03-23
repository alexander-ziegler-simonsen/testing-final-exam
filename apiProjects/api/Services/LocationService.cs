using AutoMapper;
using AutoMapper.QueryableExtensions;
using hospitalApi.Data;
using hospitalApi.DTOs.Inputs;
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

        private readonly HospitalContext _hospitalContext;

        private readonly IMapper _mapper;

        public LocationService(HospitalContext dbContext, IMapper mapper)
        {
            _hospitalContext = dbContext;
            _floors = dbContext.Floors;
            _rooms = dbContext.Rooms;
            _buildings = dbContext.Buildings;
            _mapper = mapper;
        }

        public async Task<List<LocationOutput>> getAllLocations()
        {
            var entities = await _buildings
                .Include(b => b.Floors)
                    .ThenInclude(f => f.Rooms)
                .ToListAsync();

            return _mapper.Map<List<LocationOutput>>(entities);
        }
        public async Task<LocationOutput> getOneLocations(int buildingId)
        {
            var entity = await _buildings
                .Include(b => b.Floors)
                    .ThenInclude(f => f.Rooms)
                .FirstOrDefaultAsync(b => b.Id == buildingId);

            if (entity == null)
                return null;

            return _mapper.Map<LocationOutput>(entity);
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

        public async Task<bool> EditOnefloor(int id, FloorInput input) {
            return false;
        }
        public async Task<int> PostOneFloor(FloorInput input) {
            return 0;
        }
        public async Task<bool> DeleteOneFloor(int id) {
            return false;
        }
    }
}
