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
public class MissingStorageServiceTests
{
    private HospitalContext _context = null!;
    private MissingStorageService _service = null!;

    private static readonly DateTime Ts = new(2025, 6, 1, 10, 0, 0);

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
        _service = new MissingStorageService(_context, mapper);
    }

    [TearDown]
    public void TearDown() => _context.Dispose();

    private async Task SeedThreeRecords()
    {
        _context.MedicationStorageMissings.AddRange(
            new MedicationStorageMissing { Id = 1, FkMedicationStorageId = 10, AmountMissing = 5.0,  WentMissingAt = Ts },
            new MedicationStorageMissing { Id = 2, FkMedicationStorageId = 20, AmountMissing = 12.5, WentMissingAt = Ts.AddDays(1) },
            new MedicationStorageMissing { Id = 3, FkMedicationStorageId = 10, AmountMissing = 3.0,  WentMissingAt = Ts.AddDays(2) }
        );
        await _context.SaveChangesAsync();
    }

    // GetAll

    [Test]
    public async Task GetAll_ReturnsAllMissingRecords()
    {
        await SeedThreeRecords();

        var result = (await _service.GetAll()).ToList();

        Assert.That(result, Has.Count.EqualTo(3));
    }

    // GetOne

    [Test]
    public async Task GetOne_WithValidId_ReturnsCorrectRecord()
    {
        await SeedThreeRecords();

        var result = await _service.GetOne(2);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);
            Assert.That(result!.AmountMissing, Is.EqualTo(12.5));
            Assert.That(result.FkMedicationStorageId, Is.EqualTo(20));
        });
    }

    [Test]
    public async Task GetOne_WithInvalidId_ReturnsNull()
    {
        await SeedThreeRecords();

        var result = await _service.GetOne(999);

        Assert.That(result, Is.Null);
    }

    // CreateMissingStorage

    [Test]
    public async Task CreateMissingStorage_PersistsToDatabase()
    {
        var input = new MedicationStorageMissingInput { FkMedicationStorageId = 5, AmountMissing = 8.0, WentMissingAt = Ts };

        var id = await _service.CreateMissingStorage(input);
        var fromDb = await _context.MedicationStorageMissings.FindAsync(id);

        Assert.Multiple(() =>
        {
            Assert.That(id, Is.GreaterThan(0));
            Assert.That(fromDb!.FkMedicationStorageId, Is.EqualTo(5));
            Assert.That(fromDb.AmountMissing, Is.EqualTo(8.0));
        });
    }

    // EditMissingStorage

    [Test]
    public async Task EditMissingStorage_WithValidId_UpdatesFieldsInDatabase()
    {
        _context.MedicationStorageMissings.Add(
            new MedicationStorageMissing { Id = 1, FkMedicationStorageId = 10, AmountMissing = 5.0, WentMissingAt = Ts });
        await _context.SaveChangesAsync();

        var input = new MedicationStorageMissingInput { FkMedicationStorageId = 99, AmountMissing = 20.0, WentMissingAt = Ts.AddDays(5) };
        var result = await _service.EditMissingStorage(1, input);
        var updated = await _context.MedicationStorageMissings.FindAsync(1);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.True);
            Assert.That(updated!.AmountMissing, Is.EqualTo(20.0));
            Assert.That(updated.FkMedicationStorageId, Is.EqualTo(99));
        });
    }

    [Test]
    public async Task EditMissingStorage_WithInvalidId_ReturnsFalse()
    {
        var result = await _service.EditMissingStorage(999, new MedicationStorageMissingInput());

        Assert.That(result, Is.False);
    }

    // DeleteMissingStorage

    [Test]
    public async Task DeleteMissingStorage_WithValidId_RemovesFromDatabase()
    {
        await SeedThreeRecords();

        var result = await _service.DeleteMissingStorage(1);
        var fromDb = await _context.MedicationStorageMissings.FindAsync(1);

        Assert.That(result, Is.True);
        Assert.That(fromDb, Is.Null);
    }

    [Test]
    public async Task DeleteMissingStorage_WithInvalidId_ReturnsFalse()
    {
        var result = await _service.DeleteMissingStorage(999);

        Assert.That(result, Is.False);
    }
}
