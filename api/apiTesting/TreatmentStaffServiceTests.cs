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
public class TreatmentStaffServiceTests
{
    private HospitalContext _context = null!;
    private TreatmentStaffService _service = null!;

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
        _service = new TreatmentStaffService(_context, mapper);
    }

    [TearDown]
    public void TearDown() => _context.Dispose();

    private async Task SeedThreeAssignments()
    {
        _context.TreatmentStaffs.AddRange(
            new TreatmentStaff { Id = 1, FkTreatmentId = 10, FkStaffId = 100 },
            new TreatmentStaff { Id = 2, FkTreatmentId = 20, FkStaffId = 200 },
            new TreatmentStaff { Id = 3, FkTreatmentId = 30, FkStaffId = 300 }
        );
        await _context.SaveChangesAsync();
    }

    // GetAll

    [Test]
    public async Task GetAll_ReturnsAllAssignments()
    {
        await SeedThreeAssignments();

        var result = (await _service.GetAll()).ToList();

        Assert.That(result, Has.Count.EqualTo(3));
    }

    [Test]
    public async Task GetAll_EmptyStore_ReturnsEmptyList()
    {
        var result = (await _service.GetAll()).ToList();

        Assert.That(result, Is.Empty);
    }

    [Test]
    public async Task GetAll_MapsFieldsCorrectly()
    {
        await SeedThreeAssignments();

        var first = (await _service.GetAll()).First();

        Assert.Multiple(() =>
        {
            Assert.That(first.FkTreatmentId, Is.EqualTo(10));
            Assert.That(first.FkStaffId, Is.EqualTo(100));
        });
    }

    // GetOne

    [TestCase(1, 10, 100)]
    [TestCase(2, 20, 200)]
    public async Task GetOne_ExistingId_ReturnsMappedOutput(int id, int treatmentId, int staffId)
    {
        await SeedThreeAssignments();

        var result = await _service.GetOne(id);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);
            Assert.That(result!.FkTreatmentId, Is.EqualTo(treatmentId));
            Assert.That(result.FkStaffId, Is.EqualTo(staffId));
        });
    }

    [Test]
    public async Task GetOne_NonExistentId_ReturnsNull()
    {
        await SeedThreeAssignments();

        var result = await _service.GetOne(999);

        Assert.That(result, Is.Null);
    }

    // CreateTreatmentStaff

    [Test]
    public async Task CreateTreatmentStaff_PersistsToDatabase()
    {
        var input = new TreatmentStaffInput { FkTreatmentId = 5, FkStaffId = 50 };

        await _service.CreateTreatmentStaff(input);
        var created = _context.TreatmentStaffs
            .FirstOrDefault(ts => ts.FkTreatmentId == 5 && ts.FkStaffId == 50);

        Assert.Multiple(() =>
        {
            Assert.That(created, Is.Not.Null);
            Assert.That(created!.FkTreatmentId, Is.EqualTo(5));
            Assert.That(created.FkStaffId, Is.EqualTo(50));
        });
    }

    // EditTreatmentStaff

    [Test]
    public async Task EditTreatmentStaff_WhenExists_UpdatesFieldsInDatabase()
    {
        _context.TreatmentStaffs.Add(new TreatmentStaff { Id = 1, FkTreatmentId = 10, FkStaffId = 100 });
        await _context.SaveChangesAsync();

        var result = await _service.EditTreatmentStaff(1, new TreatmentStaffInput { FkTreatmentId = 99, FkStaffId = 999 });
        var updated = await _context.TreatmentStaffs.FindAsync(1);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.True);
            Assert.That(updated!.FkTreatmentId, Is.EqualTo(99));
            Assert.That(updated.FkStaffId, Is.EqualTo(999));
        });
    }

    [Test]
    public async Task EditTreatmentStaff_WhenNotFound_ReturnsFalse()
    {
        var result = await _service.EditTreatmentStaff(99, new TreatmentStaffInput());

        Assert.That(result, Is.False);
    }

    // DeleteTreatmentStaff

    [Test]
    public async Task DeleteTreatmentStaff_WhenExists_RemovesFromDatabase()
    {
        await SeedThreeAssignments();

        var result = await _service.DeleteTreatmentStaff(2);
        var fromDb = await _context.TreatmentStaffs.FindAsync(2);

        Assert.That(result, Is.True);
        Assert.That(fromDb, Is.Null);
    }

    [Test]
    public async Task DeleteTreatmentStaff_WhenNotFound_ReturnsFalse()
    {
        var result = await _service.DeleteTreatmentStaff(99);

        Assert.That(result, Is.False);
    }
}
