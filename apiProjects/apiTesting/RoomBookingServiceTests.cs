using AutoMapper;
using hospitalApi.Data;
using hospitalApi.DTOs.Inputs;
using hospitalApi.Models;
using hospitalApi.Services;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace hospitalApiTesting;

[TestFixture]
public class RoomBookingServiceTests
{
    private HospitalContext _context = null!;
    private RoomBookingService _service = null!;

    // Fixed reference window used across most tests: 08:00 – 10:00
    private static readonly DateTime S = new DateTime(2025, 6, 1, 8, 0, 0);
    private static readonly DateTime E = new DateTime(2025, 6, 1, 10, 0, 0);

    [SetUp]
    public void SetUp()
    {
        var options = new DbContextOptionsBuilder<HospitalContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new HospitalContext(options);
        _service = new RoomBookingService(_context, new Mock<IMapper>().Object);
    }

    [TearDown]
    public void TearDown() => _context.Dispose();

    // helpers

    private async Task SeedBooking(int id, int roomId, DateTime start, DateTime end)
    {
        _context.RoomBookings.Add(new RoomBooking
        {
            Id = id,
            FkRoomId = roomId,
            StartTime = start,
            EndTime = end,
            FkPatientId = 1,
        });
        await _context.SaveChangesAsync();
    }

    // IsRoomAvailable

    [Test]
    public async Task IsRoomAvailable_WhenNoBookingsExist_ReturnsTrue()
    {
        var result = await _service.IsRoomAvailable(roomId: 1, start: S, end: E);

        Assert.That(result, Is.True);
    }

    [Test]
    public async Task IsRoomAvailable_WhenExactOverlapExists_ReturnsFalse()
    {
        await SeedBooking(1, roomId: 1, start: S, end: E);

        var result = await _service.IsRoomAvailable(roomId: 1, start: S, end: E);

        Assert.That(result, Is.False);
    }

    [Test]
    public async Task IsRoomAvailable_WhenPartialOverlapAtStart_ReturnsFalse()
    {
        // existing: 07:00–09:00, new slot starts inside it
        await SeedBooking(1, roomId: 1,
            start: S.AddHours(-1),
            end: S.AddHours(1));

        var result = await _service.IsRoomAvailable(roomId: 1, start: S, end: E);

        Assert.That(result, Is.False);
    }

    [Test]
    public async Task IsRoomAvailable_WhenPartialOverlapAtEnd_ReturnsFalse()
    {
        // existing: 09:00–11:00, new slot ends inside it
        await SeedBooking(1, roomId: 1,
            start: E.AddHours(-1),
            end: E.AddHours(1));

        var result = await _service.IsRoomAvailable(roomId: 1, start: S, end: E);

        Assert.That(result, Is.False);
    }

    [Test]
    public async Task IsRoomAvailable_WhenNewSlotContainsExistingBooking_ReturnsFalse()
    {
        // existing: 08:30–09:30, entirely inside new slot 08:00–10:00
        await SeedBooking(1, roomId: 1,
            start: S.AddMinutes(30),
            end: E.AddMinutes(-30));

        var result = await _service.IsRoomAvailable(roomId: 1, start: S, end: E);

        Assert.That(result, Is.False);
    }

    [Test]
    public async Task IsRoomAvailable_WhenAdjacentBookingEndsTouchesNewStart_ReturnsTrue()
    {
        // existing ends exactly when new slot starts — no overlap
        await SeedBooking(1, roomId: 1,
            start: S.AddHours(-2),
            end: S);   // EndTime == new start => b.EndTime > start is false

        var result = await _service.IsRoomAvailable(roomId: 1, start: S, end: E);

        Assert.That(result, Is.True);
    }

    [Test]
    public async Task IsRoomAvailable_WhenAdjacentBookingStartTouchesNewEnd_ReturnsTrue()
    {
        // existing starts exactly when new slot ends — no overlap
        await SeedBooking(1, roomId: 1,
            start: E,             // StartTime == new end => b.StartTime < end is false
            end: E.AddHours(2));

        var result = await _service.IsRoomAvailable(roomId: 1, start: S, end: E);

        Assert.That(result, Is.True);
    }

    [Test]
    public async Task IsRoomAvailable_WhenOverlapIsForDifferentRoom_ReturnsTrue()
    {
        await SeedBooking(1, roomId: 2, start: S, end: E);

        var result = await _service.IsRoomAvailable(roomId: 1, start: S, end: E);

        Assert.That(result, Is.True);
    }

    [Test]
    public async Task IsRoomAvailable_WithExcludeBookingId_IgnoresExcludedBooking()
    {
        // booking 5 overlaps, but we're editing it — it should be excluded
        await SeedBooking(5, roomId: 1, start: S, end: E);

        var result = await _service.IsRoomAvailable(
            roomId: 1, start: S, end: E, excludeBookingId: 5);

        Assert.That(result, Is.True);
    }

    [Test]
    public async Task IsRoomAvailable_WithExcludeBookingId_StillBlocksOtherOverlaps()
    {
        await SeedBooking(5, roomId: 1, start: S, end: E);
        // a second conflicting booking that is NOT excluded
        await SeedBooking(6, roomId: 1,
            start: S.AddMinutes(30),
            end: E.AddMinutes(30));

        var result = await _service.IsRoomAvailable(
            roomId: 1, start: S, end: E, excludeBookingId: 5);

        Assert.That(result, Is.False);
    }
}
