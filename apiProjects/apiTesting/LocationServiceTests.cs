using AutoMapper;
using hospitalApi.Data;
using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;
using hospitalApi.Mapping;
using hospitalApi.Models;
using hospitalApi.Services;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiTesting;

// Uses a real InMemoryDatabase so that EF Core's Include().ThenInclude() chains
// work correctly. The real MappingProfile is used to keep mappings honest.

[TestFixture]
public class LocationServiceTests
{
    private HospitalContext _context = null!;
    private IMapper _mapper = null!;
    private LocationService _service = null!;

    [SetUp]
    public void SetUp()
    {
        var options = new DbContextOptionsBuilder<HospitalContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _context = new HospitalContext(options);

        var mapperConfig = new MapperConfiguration(
            cfg => cfg.AddProfile(new MappingProfile()),
            Microsoft.Extensions.Logging.Abstractions.NullLoggerFactory.Instance);
        _mapper = mapperConfig.CreateMapper();

        _service = new LocationService(_context, _mapper);
    }

    [TearDown]
    public void TearDown() => _context.Dispose();

    private Building SeedBuilding(string name = "Main", string? address = "123 St")
    {
        var building = new Building { Name = name, Address = address };
        _context.Buildings.Add(building);
        _context.SaveChanges();
        return building;
    }

    private Floor SeedFloor(int buildingId, string name = "Ground")
    {
        var floor = new Floor { Name = name, FkBuildingId = buildingId };
        _context.Floors.Add(floor);
        _context.SaveChanges();
        return floor;
    }

    private Room SeedRoom(int floorId, string name = "101")
    {
        var room = new Room { Name = name, FkFloorId = floorId };
        _context.Rooms.Add(room);
        _context.SaveChanges();
        return room;
    }

    // getAllLocations

    [Test]
    public async Task GetAllLocations_ReturnsAllBuildings()
    {
        SeedBuilding("BuildingA");
        SeedBuilding("BuildingB");

        var result = await _service.getAllLocations();

        Assert.That(result, Has.Count.EqualTo(2));
    }

    [Test]
    public async Task GetAllLocations_EmptyStore_ReturnsEmptyList()
    {
        var result = await _service.getAllLocations();

        Assert.That(result, Is.Empty);
    }

    [Test]
    public async Task GetAllLocations_IncludesFloorsAndRooms()
    {
        var b = SeedBuilding("B");
        var f = SeedFloor(b.Id, "Floor 1");
        SeedRoom(f.Id, "Room A");

        var result = await _service.getAllLocations();

        Assert.That(result[0].FloorsWithRooms, Has.Count.EqualTo(1));
        Assert.That(result[0].FloorsWithRooms[0].Rooms, Has.Count.EqualTo(1));
    }

    // getOneLocations

    [Test]
    public async Task GetOneLocations_ExistingId_ReturnsBuildingWithHierarchy()
    {
        var b = SeedBuilding("West Wing");
        var f = SeedFloor(b.Id, "Level 2");
        SeedRoom(f.Id, "201");

        var result = await _service.getOneLocations(b.Id);

        Assert.That(result, Is.Not.Null);
        Assert.That(result!.Building.Name, Is.EqualTo("West Wing"));
        Assert.That(result.FloorsWithRooms, Has.Count.EqualTo(1));
        Assert.That(result.FloorsWithRooms[0].Rooms[0].Name, Is.EqualTo("201"));
    }

    [Test]
    public async Task GetOneLocations_NonExistentId_ReturnsNull()
    {
        var result = await _service.getOneLocations(9999);

        Assert.That(result, Is.Null);
    }

    // getOneAllFloors

    [Test]
    public async Task GetOneAllFloors_ReturnsAllFloors()
    {
        var b = SeedBuilding();
        SeedFloor(b.Id, "Floor 1");
        SeedFloor(b.Id, "Floor 2");

        var result = await _service.getOneAllFloors();

        Assert.That(result, Has.Count.EqualTo(2));
    }

    [Test]
    public async Task GetOneAllFloors_IncludesRooms()
    {
        var b = SeedBuilding();
        var f = SeedFloor(b.Id);
        SeedRoom(f.Id, "Room X");
        SeedRoom(f.Id, "Room Y");

        var result = await _service.getOneAllFloors();

        Assert.That(result[0].Rooms, Has.Count.EqualTo(2));
    }

    // getOneFloorWithRooms

    [Test]
    public async Task GetOneFloorWithRooms_ExistingId_ReturnsFloorWithRooms()
    {
        var b = SeedBuilding();
        var f = SeedFloor(b.Id, "ICU Floor");
        SeedRoom(f.Id, "ICU-1");

        var result = await _service.getOneFloorWithRooms(f.Id);

        Assert.That(result, Is.Not.Null);
        Assert.That(result!.Floor.Name, Is.EqualTo("ICU Floor"));
        Assert.That(result.Rooms, Has.Count.EqualTo(1));
    }

    [Test]
    public async Task GetOneFloorWithRooms_NonExistentId_ReturnsNull()
    {
        var result = await _service.getOneFloorWithRooms(9999);

        Assert.That(result, Is.Null);
    }

    // EditOnefloor

    [Test]
    public async Task EditOnefloor_WhenExists_UpdatesNameAndBuildingAndReturnsTrue()
    {
        var b1 = SeedBuilding("B1");
        var b2 = SeedBuilding("B2");
        var f = SeedFloor(b1.Id, "OldName");
        var input = new FloorInput { Name = "NewName", FkBuildingId = b2.Id };

        var result = await _service.EditOnefloor(f.Id, input);

        Assert.That(result, Is.True);
        var updated = _context.Floors.Find(f.Id);
        Assert.That(updated!.Name, Is.EqualTo("NewName"));
        Assert.That(updated.FkBuildingId, Is.EqualTo(b2.Id));
    }

    [Test]
    public async Task EditOnefloor_WhenNotFound_ReturnsFalse()
    {
        var result = await _service.EditOnefloor(9999, new FloorInput { Name = "X", FkBuildingId = 1 });

        Assert.That(result, Is.False);
    }

    // PostOneFloor

    [Test]
    public async Task PostOneFloor_CreatesFloorAndReturnsId()
    {
        var b = SeedBuilding();
        var input = new FloorInput { Name = "New Floor", FkBuildingId = b.Id };

        var id = await _service.PostOneFloor(input);

        Assert.That(id, Is.GreaterThan(0));
        Assert.That(_context.Floors.Find(id), Is.Not.Null);
    }

    // DeleteOneFloor

    [Test]
    public async Task DeleteOneFloor_WhenExists_RemovesFloorAndReturnsTrue()
    {
        var b = SeedBuilding();
        var f = SeedFloor(b.Id);

        var result = await _service.DeleteOneFloor(f.Id);

        Assert.That(result, Is.True);
        Assert.That(_context.Floors.Find(f.Id), Is.Null);
    }

    [Test]
    public async Task DeleteOneFloor_WhenNotFound_ReturnsFalse()
    {
        var result = await _service.DeleteOneFloor(9999);

        Assert.That(result, Is.False);
    }
}
