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
public class StorageServiceTests
{
    private HospitalContext _context = null!;
    private StorageService _service = null!;

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
        _service = new StorageService(_context, mapper);
    }

    [TearDown]
    public void TearDown() => _context.Dispose();

    private async Task SeedThreeStorages()
    {
        _context.MedicationStorages.AddRange(
            new MedicationStorage { Id = 1, FkMedicationId = 101, Amount = 50.0 },
            new MedicationStorage { Id = 2, FkMedicationId = 102, Amount = 20.0 },
            new MedicationStorage { Id = 3, FkMedicationId = 103, Amount = 0.0  }
        );
        await _context.SaveChangesAsync();
    }

    // GetAll

    [Test]
    public async Task GetAll_ReturnsAllStorageRecords()
    {
        await SeedThreeStorages();

        var result = (await _service.GetAll()).ToList();

        Assert.That(result, Has.Count.EqualTo(3));
    }

    // GetOne

    [Test]
    public async Task GetOne_WithValidId_ReturnsCorrectStorage()
    {
        await SeedThreeStorages();

        var result = await _service.GetOne(2);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);
            Assert.That(result!.Amount, Is.EqualTo(20.0));
            Assert.That(result.FkMedicationId, Is.EqualTo(102));
        });
    }

    [Test]
    public async Task GetOne_WithInvalidId_ReturnsNull()
    {
        await SeedThreeStorages();

        var result = await _service.GetOne(999);

        Assert.That(result, Is.Null);
    }

    // EditStorage

    [Test]
    public async Task EditStorage_WithValidId_UpdatesAmountInDatabase()
    {
        _context.MedicationStorages.Add(new MedicationStorage { Id = 1, FkMedicationId = 101, Amount = 50.0 });
        await _context.SaveChangesAsync();

        var result = await _service.EditStorage(1, new MedicationStorageInput { FkMedicationId = 101, Amount = 35.0 });
        var updated = await _context.MedicationStorages.FindAsync(1);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.True);
            Assert.That(updated!.Amount, Is.EqualTo(35.0));
        });
    }

    [Test]
    public async Task EditStorage_StockDeduction_CorrectlyReducesAmount()
    {
        // Simulates submitting a missing report which calls EditStorage to deduct stock
        const double initialAmount = 100.0;
        const double missingAmount = 15.0;
        _context.MedicationStorages.Add(new MedicationStorage { Id = 1, FkMedicationId = 101, Amount = initialAmount });
        await _context.SaveChangesAsync();

        await _service.EditStorage(1, new MedicationStorageInput { FkMedicationId = 101, Amount = initialAmount - missingAmount });
        var updated = await _context.MedicationStorages.FindAsync(1);

        Assert.That(updated!.Amount, Is.EqualTo(initialAmount - missingAmount));
    }

    [Test]
    public async Task EditStorage_WithInvalidId_ReturnsFalse()
    {
        var result = await _service.EditStorage(999, new MedicationStorageInput());

        Assert.That(result, Is.False);
    }

    // DeleteStorage

    [Test]
    public async Task DeleteStorage_WithValidId_RemovesFromDatabase()
    {
        await SeedThreeStorages();

        var result = await _service.DeleteStorage(1);
        var fromDb = await _context.MedicationStorages.FindAsync(1);

        Assert.That(result, Is.True);
        Assert.That(fromDb, Is.Null);
    }

    [Test]
    public async Task DeleteStorage_WithInvalidId_ReturnsFalse()
    {
        var result = await _service.DeleteStorage(999);

        Assert.That(result, Is.False);
    }

    // CreateStorage

    [Test]
    public async Task CreateStorage_PersistsToDatabase()
    {
        var input = new MedicationStorageInput { FkMedicationId = 5, Amount = 99.0 };

        var id = await _service.CreateStorage(input);
        var fromDb = await _context.MedicationStorages.FindAsync(id);

        Assert.Multiple(() =>
        {
            Assert.That(id, Is.GreaterThan(0));
            Assert.That(fromDb!.FkMedicationId, Is.EqualTo(5));
            Assert.That(fromDb.Amount, Is.EqualTo(99.0));
        });
    }
}
