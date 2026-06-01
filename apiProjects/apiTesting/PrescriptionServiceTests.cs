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
public class PrescriptionServiceTests
{
    private HospitalContext _context = null!;
    private PrescriptionService _service = null!;

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
        _service = new PrescriptionService(_context, mapper);
    }

    [TearDown]
    public void TearDown() => _context.Dispose();

    private async Task SeedThreePrescriptions()
    {
        _context.Prescriptions.AddRange(
            new Prescription { Id = 1, FkMedicationId = 10, FkTreatmentId = 100, FkPrescribedByStaffId = 1, Doses = 2.0 },
            new Prescription { Id = 2, FkMedicationId = 20, FkTreatmentId = 100, FkPrescribedByStaffId = 2, Doses = 1.5 },
            new Prescription { Id = 3, FkMedicationId = 10, FkTreatmentId = 200, FkPrescribedByStaffId = 1, Doses = 3.0 }
        );
        await _context.SaveChangesAsync();
    }

    // GetAll

    [Test]
    public async Task GetAll_ReturnsAllPrescriptions()
    {
        await SeedThreePrescriptions();

        var result = (await _service.GetAll()).ToList();

        Assert.That(result, Has.Count.EqualTo(3));
    }

    // GetOne

    [Test]
    public async Task GetOne_WithValidId_ReturnsCorrectPrescription()
    {
        await SeedThreePrescriptions();

        var result = await _service.GetOne(2);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);
            Assert.That(result!.FkMedicationId, Is.EqualTo(20));
            Assert.That(result.Doses, Is.EqualTo(1.5));
        });
    }

    [Test]
    public async Task GetOne_WithInvalidId_ReturnsNull()
    {
        await SeedThreePrescriptions();

        var result = await _service.GetOne(999);

        Assert.That(result, Is.Null);
    }

    // EditPrescription

    [Test]
    public async Task EditPrescription_WithValidId_UpdatesAllFieldsInDatabase()
    {
        _context.Prescriptions.Add(new Prescription
        {
            Id = 1, FkMedicationId = 10, FkTreatmentId = 100, FkPrescribedByStaffId = 1, Doses = 2.0
        });
        await _context.SaveChangesAsync();

        var input = new PrescriptionInput { FkMedicationId = 99, FkTreatmentId = 999, FkPrescribedByStaffId = 5, Doses = 4.0 };
        var result = await _service.EditPrescription(1, input);
        var updated = await _context.Prescriptions.FindAsync(1);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.True);
            Assert.That(updated!.FkMedicationId, Is.EqualTo(99));
            Assert.That(updated.FkTreatmentId, Is.EqualTo(999));
            Assert.That(updated.FkPrescribedByStaffId, Is.EqualTo(5));
            Assert.That(updated.Doses, Is.EqualTo(4.0));
        });
    }

    [Test]
    public async Task EditPrescription_WithInvalidId_ReturnsFalse()
    {
        var result = await _service.EditPrescription(999, new PrescriptionInput());

        Assert.That(result, Is.False);
    }

    // DeletePrescription

    [Test]
    public async Task DeletePrescription_WithValidId_RemovesFromDatabase()
    {
        await SeedThreePrescriptions();

        var result = await _service.DeletePrescription(2);
        var fromDb = await _context.Prescriptions.FindAsync(2);

        Assert.That(result, Is.True);
        Assert.That(fromDb, Is.Null);
    }

    [Test]
    public async Task DeletePrescription_WithInvalidId_ReturnsFalse()
    {
        var result = await _service.DeletePrescription(999);

        Assert.That(result, Is.False);
    }

    // CreatePrescription

    [Test]
    public async Task CreatePrescription_PersistsToDatabase()
    {
        var input = new PrescriptionInput { FkMedicationId = 5, FkTreatmentId = 50, FkPrescribedByStaffId = 1, Doses = 1.0 };

        var id = await _service.CreatePrescription(input);
        var fromDb = await _context.Prescriptions.FindAsync(id);

        Assert.Multiple(() =>
        {
            Assert.That(id, Is.GreaterThan(0));
            Assert.That(fromDb!.FkMedicationId, Is.EqualTo(5));
            Assert.That(fromDb.Doses, Is.EqualTo(1.0));
        });
    }
}
