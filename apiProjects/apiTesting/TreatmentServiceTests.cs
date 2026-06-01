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
public class TreatmentServiceTests
{
    private HospitalContext _context = null!;
    private TreatmentService _service = null!;

    private static readonly DateTime T1 = new(2025, 1, 1, 8, 0, 0);
    private static readonly DateTime T2 = new(2025, 1, 2, 8, 0, 0);
    private static readonly DateTime T3 = new(2025, 1, 3, 8, 0, 0);

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
        _service = new TreatmentService(_context, mapper);
    }

    [TearDown]
    public void TearDown() => _context.Dispose();

    private async Task SeedThreeTreatments()
    {
        _context.Treatments.AddRange(
            new Treatment { Id = 1, FkPatientId = 10, Description = "Alpha",   Time = T3 },
            new Treatment { Id = 2, FkPatientId = 20, Description = "Bravo",   Time = T1 },
            new Treatment { Id = 3, FkPatientId = 10, Description = "Charlie", Time = T2 }
        );
        await _context.SaveChangesAsync();
    }

    // GetAll – no filter

    [Test]
    public async Task GetAll_WithNoFilter_ReturnsAllTreatments()
    {
        await SeedThreeTreatments();

        var result = (await _service.GetAll()).ToList();

        Assert.That(result, Has.Count.EqualTo(3));
    }

    // GetAll – filter by Description

    [Test]
    public async Task GetAll_FilterByDescription_ReturnsMatchingTreatments()
    {
        await SeedThreeTreatments();

        var result = (await _service.GetAll(new TreatmentInput { Description = "alpha" })).ToList();

        Assert.That(result, Has.Count.EqualTo(1));
        Assert.That(result[0].Description, Is.EqualTo("Alpha"));
    }

    [Test]
    public async Task GetAll_FilterByDescription_IsCaseInsensitive()
    {
        await SeedThreeTreatments();

        var result = (await _service.GetAll(new TreatmentInput { Description = "BRAVO" })).ToList();

        Assert.That(result, Has.Count.EqualTo(1));
        Assert.That(result[0].Description, Is.EqualTo("Bravo"));
    }

    // GetAll – filter by FkPatientId

    [Test]
    public async Task GetAll_FilterByPatientId_ReturnsMatchingTreatments()
    {
        await SeedThreeTreatments();

        var result = (await _service.GetAll(new TreatmentInput { FkPatientId = 10 })).ToList();

        Assert.That(result, Has.Count.EqualTo(2));
        Assert.That(result.All(t => t.FkPatientId == 10), Is.True);
    }

    [Test]
    public async Task GetAll_FilterByPatientId_WhenZero_ReturnsAll()
    {
        await SeedThreeTreatments();
        // FkPatientId == 0 is the "no filter" sentinel
        var result = (await _service.GetAll(new TreatmentInput { FkPatientId = 0 })).ToList();

        Assert.That(result, Has.Count.EqualTo(3));
    }

    // GetAll – sort

    [TestCase("description", "asc",  new[] { "Alpha", "Bravo", "Charlie" })]
    [TestCase("description", "desc", new[] { "Charlie", "Bravo", "Alpha" })]
    public async Task GetAll_SortByDescription_ReturnsCorrectOrder(
        string sortBy, string sortDir, string[] expected)
    {
        await SeedThreeTreatments();

        var result = (await _service.GetAll(sortBy: sortBy, sortDir: sortDir))
            .Select(t => t.Description).ToList();

        Assert.That(result, Is.EqualTo(expected));
    }

    [Test]
    public async Task GetAll_SortByTimeAsc_ReturnsChronologicalOrder()
    {
        await SeedThreeTreatments();

        var result = (await _service.GetAll(sortBy: "time", sortDir: "asc"))
            .Select(t => t.Id).ToList();

        Assert.That(result, Is.EqualTo(new[] { 2, 3, 1 })); // T1, T2, T3
    }

    [Test]
    public async Task GetAll_UnknownSortBy_DefaultsSortById()
    {
        _context.Treatments.AddRange(
            new Treatment { Id = 3, FkPatientId = 10, Description = "Z", Time = T1 },
            new Treatment { Id = 1, FkPatientId = 10, Description = "A", Time = T2 },
            new Treatment { Id = 2, FkPatientId = 10, Description = "M", Time = T3 }
        );
        await _context.SaveChangesAsync();

        var result = (await _service.GetAll(sortBy: "unknown"))
            .Select(t => t.Id).ToList();

        Assert.That(result, Is.EqualTo(new[] { 1, 2, 3 }));
    }

    // GetOne

    [Test]
    public async Task GetOne_WithValidId_ReturnsCorrectTreatment()
    {
        await SeedThreeTreatments();

        var result = await _service.GetOne(2);

        Assert.That(result, Is.Not.Null);
        Assert.That(result!.Description, Is.EqualTo("Bravo"));
        Assert.That(result.FkPatientId, Is.EqualTo(20));
    }

    [Test]
    public async Task GetOne_WithInvalidId_ReturnsNull()
    {
        await SeedThreeTreatments();

        var result = await _service.GetOne(999);

        Assert.That(result, Is.Null);
    }

    // EditTreatment

    [Test]
    public async Task EditTreatment_WithValidId_UpdatesFieldsInDatabase()
    {
        _context.Treatments.Add(new Treatment { Id = 1, FkPatientId = 10, Description = "Old", Time = T1 });
        await _context.SaveChangesAsync();

        var result = await _service.EditTreatment(1, new TreatmentInput { FkPatientId = 99, Description = "Updated", Time = T3 });
        var updated = await _context.Treatments.FindAsync(1);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.True);
            Assert.That(updated!.Description, Is.EqualTo("Updated"));
            Assert.That(updated.FkPatientId, Is.EqualTo(99));
            Assert.That(updated.Time, Is.EqualTo(T3));
        });
    }

    [Test]
    public async Task EditTreatment_WithInvalidId_ReturnsFalse()
    {
        var result = await _service.EditTreatment(999, new TreatmentInput());

        Assert.That(result, Is.False);
    }

    // DeleteTreatment

    [Test]
    public async Task DeleteTreatment_WithValidId_RemovesFromDatabase()
    {
        await SeedThreeTreatments();

        var result = await _service.DeleteTreatment(1);
        var fromDb = await _context.Treatments.FindAsync(1);

        Assert.That(result, Is.True);
        Assert.That(fromDb, Is.Null);
    }

    [Test]
    public async Task DeleteTreatment_WithInvalidId_ReturnsFalse()
    {
        var result = await _service.DeleteTreatment(999);

        Assert.That(result, Is.False);
    }

    // CreateTreatment

    [Test]
    public async Task CreateTreatment_PersistsToDatabase()
    {
        var input = new TreatmentInput { FkPatientId = 5, Description = "New treatment", Time = T1 };

        var id = await _service.CreateTreatment(input);
        var fromDb = await _context.Treatments.FindAsync(id);

        Assert.Multiple(() =>
        {
            Assert.That(id, Is.GreaterThan(0));
            Assert.That(fromDb!.Description, Is.EqualTo("New treatment"));
            Assert.That(fromDb.FkPatientId, Is.EqualTo(5));
        });
    }
}
