using AutoMapper;
using hospitalApi.Data;
using hospitalApi.DTOs.Inputs;
using hospitalApi.Mapping;
using hospitalApi.Models;
using hospitalApi.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;

namespace hospitalApiTesting;

[TestFixture]
public class StaffServiceTests
{
    private HospitalContext _context = null!;
    private StaffService _service = null!;

    [SetUp]
    public void SetUp()
    {
        var options = new DbContextOptionsBuilder<HospitalContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        _context = new HospitalContext(options);
        var mapper = new MapperConfiguration(
            cfg => cfg.AddProfile(new MappingProfile()),
            NullLoggerFactory.Instance).CreateMapper();
        _service = new StaffService(_context, mapper);
    }

    [TearDown]
    public void TearDown() => _context.Dispose();

    private async Task SeedThreeStaff()
    {
        _context.Staff.AddRange(
            new Staff { Id = 1, Firstname = "Alice",   Lastname = "Adams",   FkRoleId = 1 },
            new Staff { Id = 2, Firstname = "Bob",     Lastname = "Brown",   FkRoleId = 2 },
            new Staff { Id = 3, Firstname = "Charlie", Lastname = "Collins", FkRoleId = 1 }
        );
        await _context.SaveChangesAsync();
    }

    // GetAll

    [Test]
    public async Task GetAll_ReturnsAllStaffMembers()
    {
        await SeedThreeStaff();

        var result = (await _service.GetAll()).ToList();

        Assert.That(result, Has.Count.EqualTo(3));
    }

    // GetOne

    [Test]
    public async Task GetOne_WithValidId_ReturnsCorrectStaff()
    {
        await SeedThreeStaff();

        var result = await _service.GetOne(2);

        Assert.That(result, Is.Not.Null);
        Assert.That(result!.Firstname, Is.EqualTo("Bob"));
        Assert.That(result.FkRoleId, Is.EqualTo(2));
    }

    [Test]
    public async Task GetOne_WithInvalidId_ReturnsNull()
    {
        await SeedThreeStaff();

        var result = await _service.GetOne(999);

        Assert.That(result, Is.Null);
    }

    // EditStaff

    [Test]
    public async Task EditStaff_WithValidId_UpdatesFieldsInDatabase()
    {
        _context.Staff.Add(new Staff { Id = 1, Firstname = "Alice", Lastname = "Adams", FkRoleId = 1 });
        await _context.SaveChangesAsync();

        var result = await _service.EditStaff(1, new StaffInput { Firstname = "Alicia", Lastname = "Adams", FkRoleId = 2 });
        var updated = await _context.Staff.FindAsync(1);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.True);
            Assert.That(updated!.Firstname, Is.EqualTo("Alicia"));
            Assert.That(updated.FkRoleId, Is.EqualTo(2));
        });
    }

    [Test]
    public async Task EditStaff_WithInvalidId_ReturnsFalse()
    {
        var result = await _service.EditStaff(999, new StaffInput());

        Assert.That(result, Is.False);
    }

    // DeleteStaff

    [Test]
    public async Task DeleteStaff_WithValidId_RemovesFromDatabase()
    {
        await SeedThreeStaff();

        var result = await _service.DeleteStaff(2);
        var fromDb = await _context.Staff.FindAsync(2);

        Assert.That(result, Is.True);
        Assert.That(fromDb, Is.Null);
    }

    [Test]
    public async Task DeleteStaff_WithInvalidId_ReturnsFalse()
    {
        var result = await _service.DeleteStaff(999);

        Assert.That(result, Is.False);
    }

    // CreateStaff

    [Test]
    public async Task CreateStaff_PersistsToDatabase()
    {
        var input = new StaffInput { Firstname = "Eve", Lastname = "Evans", FkRoleId = 3 };

        var id = await _service.CreateStaff(input);
        var fromDb = await _context.Staff.FindAsync(id);

        Assert.Multiple(() =>
        {
            Assert.That(id, Is.GreaterThan(0));
            Assert.That(fromDb!.Firstname, Is.EqualTo("Eve"));
            Assert.That(fromDb.Lastname, Is.EqualTo("Evans"));
            Assert.That(fromDb.FkRoleId, Is.EqualTo(3));
        });
    }
}
