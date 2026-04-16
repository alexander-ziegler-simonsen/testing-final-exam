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

        public async Task<IEnumerable<RoomBookingOutput>> GetAll()
        {
            var entities = await _bookings.ToListAsync();
            return _mapper.Map<IEnumerable<RoomBookingOutput>>(entities);
        }

        public async Task<RoomBookingOutput?> GetOne(int id)
        {
            var entity = await _bookings.FirstOrDefaultAsync(r => r.Id == id);
            if (entity == null) return null;
            return _mapper.Map<RoomBookingOutput>(entity);
        }

        public async Task<bool> EditRoomBooking(int roomBookingId, RoomBookingInput editedRoomBookingData)
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

        public async Task<bool> CreateRoomBooking(RoomBookingInput newRoomBooking)
        {
            var entity = _mapper.Map<RoomBooking>(newRoomBooking);
            await _bookings.AddAsync(entity);
            await _hospitalContext.SaveChangesAsync();
            return true;
        }
    }
}
