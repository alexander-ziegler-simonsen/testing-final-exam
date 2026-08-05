using AutoMapper;
using hospitalApi.Data;
using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;
using hospitalApi.Models;
using hospitalApi.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace hospitalApi.Services
{
    public class RoomBookingService : IRoomBookingService
    {
        private readonly DbSet<RoomBooking> _bookings;
        private readonly HospitalContext _hospitalContext;
        private readonly IMapper _mapper;

        public RoomBookingService(HospitalContext dbContext, IMapper mapper)
        {
            _hospitalContext = dbContext;
            _bookings = dbContext.RoomBookings;
            _mapper = mapper;
        }

        public async Task<IEnumerable<RoomBookingOutputDto>> GetAll()
        {
            var entities = await _bookings.ToListAsync();
            return _mapper.Map<IEnumerable<RoomBookingOutputDto>>(entities);
        }

        public async Task<RoomBookingOutputDto?> GetOne(int id)
        {
            var entity = await _bookings.FirstOrDefaultAsync(r => r.Id == id);
            if (entity == null) return null;
            return _mapper.Map<RoomBookingOutputDto>(entity);
        }

        public async Task<bool> EditRoomBooking(int roomBookingId, RoomBookingInputDto editedRoomBookingData)
        {
            var entity = await _bookings.FirstOrDefaultAsync(r => r.Id == roomBookingId);
            if (entity == null) return false;

            entity.FkRoomId = editedRoomBookingData.FkRoomId;
            entity.FkPatientId = editedRoomBookingData.FkPatientId;
            entity.StartTime = editedRoomBookingData.StartTime;
            entity.EndTime = editedRoomBookingData.EndTime;

            await _hospitalContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteRoomBooking(int id)
        {
            var entity = await _bookings.FirstOrDefaultAsync(r => r.Id == id);
            if (entity == null) return false;

            _bookings.Remove(entity);
            await _hospitalContext.SaveChangesAsync();
            return true;
        }

        public async Task<int> CreateRoomBooking(RoomBookingInputDto newRoomBooking)
        {
            var entity = _mapper.Map<RoomBooking>(newRoomBooking);
            await _bookings.AddAsync(entity);
            await _hospitalContext.SaveChangesAsync();
            return entity.Id;
        }

        public async Task<bool> IsRoomAvailable(int roomId, DateTime start, DateTime end, int? excludeBookingId = null)
        {
            return !await _bookings.AnyAsync(b =>
                b.FkRoomId == roomId &&
                (excludeBookingId == null || b.Id != excludeBookingId) &&
                b.StartTime < end &&
                b.EndTime > start
            );
        }
    }
}
