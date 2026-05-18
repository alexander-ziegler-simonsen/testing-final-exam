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
            var entities = await _floors
                .Include(f => f.Rooms)
                .ToListAsync();

            return _mapper.Map<List<FloorRoomsOutput>>(entities);
        }

        public async Task<FloorRoomsOutput> getOneFloorWithRooms(int floorId)
        {
            var entity = await _floors
                .Include(f => f.Rooms)
                .FirstOrDefaultAsync(f => f.Id == floorId);

            if (entity == null)
                return null;

            return _mapper.Map<FloorRoomsOutput>(entity);
        }

        public async Task<bool> EditOnefloor(int id, FloorInput input)
        {
            var entity = await _floors.FirstOrDefaultAsync(f => f.Id == id);
            if (entity == null)
                return false;

            entity.Name = input.Name;
            entity.FkBuildingId = input.FkBuildingId;

            await _hospitalContext.SaveChangesAsync();
            return true;
        }

        public async Task<int> PostOneFloor(FloorInput input)
        {
            var entity = _mapper.Map<Floor>(input);
            await _floors.AddAsync(entity);
            await _hospitalContext.SaveChangesAsync();
            return entity.Id;
        }

        public async Task<bool> DeleteOneFloor(int id)
        {
            var entity = await _floors.FirstOrDefaultAsync(f => f.Id == id);
            if (entity == null)
                return false;

            _floors.Remove(entity);
            await _hospitalContext.SaveChangesAsync();
            return true;
        }
    }
}
