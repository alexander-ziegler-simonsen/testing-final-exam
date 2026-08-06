using AutoMapper;
using hospitalApi.Data;
using hospitalApi.Models;
using hospitalApi.Services;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace hospitalApiTesting;

public class RoomBookingServiceTests
{
    // This is a boundary condition in the overlap-detection math
    // (RoomBookingService.IsRoomAvailable: b.StartTime < end && b.EndTime > start)
    // that would take manual DB setup/teardown to check via Postman for every
    // case, but is one seeded row and one assertion here: a booking that
    // starts exactly when another one ends should NOT count as an overlap.
    [Test]
    public async Task IsRoomAvailable_ForBackToBackBooking_ReturnsTrue()
    {
        var options = new DbContextOptionsBuilder<HospitalContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        using var context = new HospitalContext(options);
        context.RoomBookings.Add(new RoomBooking
        {
            Id = 1,
            FkRoomId = 1,
            FkPatientId = 1,
            StartTime = new DateTime(2025, 10, 7, 8, 0, 0),
            EndTime = new DateTime(2025, 10, 7, 12, 0, 0)
        });
        await context.SaveChangesAsync();

        var service = new RoomBookingService(context, Mock.Of<IMapper>());

        var isAvailable = await service.IsRoomAvailable(
            roomId: 1,
            start: new DateTime(2025, 10, 7, 12, 0, 0),
            end: new DateTime(2025, 10, 7, 13, 0, 0));

        Assert.That(isAvailable, Is.True);
    }
}
