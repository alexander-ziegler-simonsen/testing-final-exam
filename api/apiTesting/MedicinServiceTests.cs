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
public class MedicinServiceTests
{
    private HospitalContext _context = null!;
    private MedicinService _service = null!;

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
        _service = new MedicinService(_context, mapper);
    }

    [TearDown]
    public void TearDown() => _context.Dispose();

    private async Task SeedThreeMeds()
    {
        _context.Medications.AddRange(
            new Medication { Id = 1, Name = "Paracetamol", GenericName = "Acetaminophen", Brand = "Panodil",  Form = "Tablet",  Strength = "500mg", Category = "Analgesic",  Description = "Pain relief"       },
            new Medication { Id = 2, Name = "Ibuprofen",   GenericName = "Ibuprofen",     Brand = "Advil",    Form = "Tablet",  Strength = "200mg", Category = "NSAID",      Description = "Anti-inflammatory" },
            new Medication { Id = 3, Name = "Amoxicillin", GenericName = "Amoxicillin",   Brand = "Amoxil",   Form = "Capsule", Strength = "250mg", Category = "Antibiotic", Description = "Antibiotic"        }
        );
        await _context.SaveChangesAsync();
    }

    // GetAll

    [Test]
    public async Task GetAll_ReturnsAllMedications()
    {
        await SeedThreeMeds();

        var result = (await _service.GetAll()).ToList();

        Assert.That(result, Has.Count.EqualTo(3));
    }

    // GetOne

    [Test]
    public async Task GetOne_WithValidId_ReturnsCorrectMedication()
    {
        await SeedThreeMeds();

        var result = await _service.GetOne(2);

        Assert.That(result, Is.Not.Null);
        Assert.That(result!.Name, Is.EqualTo("Ibuprofen"));
    }

    [Test]
    public async Task GetOne_WithInvalidId_ReturnsNull()
    {
        await SeedThreeMeds();

        var result = await _service.GetOne(999);

        Assert.That(result, Is.Null);
    }

    // EditMedication

    [Test]
    public async Task EditMedication_WithValidId_UpdatesAllFieldsInDatabase()
    {
        _context.Medications.Add(new Medication
        {
            Id = 1, Name = "Old", GenericName = "OldGeneric", Brand = "OldBrand",
            Form = "Tablet", Strength = "100mg", Category = "OldCat", Description = "Old desc"
        });
        await _context.SaveChangesAsync();

        var input = new MedicationInput
        {
            Name = "New", GenericName = "NewGeneric", Brand = "NewBrand",
            Form = "Capsule", Strength = "200mg", Category = "NewCat", Description = "New desc"
        };
        var result = await _service.EditMedication(1, input);
        var updated = await _context.Medications.FindAsync(1);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.True);
            Assert.That(updated!.Name, Is.EqualTo("New"));
            Assert.That(updated.GenericName, Is.EqualTo("NewGeneric"));
            Assert.That(updated.Brand, Is.EqualTo("NewBrand"));
            Assert.That(updated.Form, Is.EqualTo("Capsule"));
            Assert.That(updated.Strength, Is.EqualTo("200mg"));
            Assert.That(updated.Category, Is.EqualTo("NewCat"));
            Assert.That(updated.Description, Is.EqualTo("New desc"));
        });
    }

    [Test]
    public async Task EditMedication_WithInvalidId_ReturnsFalse()
    {
        var result = await _service.EditMedication(999, new MedicationInput());

        Assert.That(result, Is.False);
    }

    // DeleteMedication

    [Test]
    public async Task DeleteMedication_WithValidId_RemovesFromDatabase()
    {
        await SeedThreeMeds();

        var result = await _service.DeleteMedication(3);
        var fromDb = await _context.Medications.FindAsync(3);

        Assert.That(result, Is.True);
        Assert.That(fromDb, Is.Null);
    }

    [Test]
    public async Task DeleteMedication_WithInvalidId_ReturnsFalse()
    {
        var result = await _service.DeleteMedication(999);

        Assert.That(result, Is.False);
    }

    // CreateMedication

    [Test]
    public async Task CreateMedication_PersistsToDatabase()
    {
        var input = new MedicationInput { Name = "TestMed", Brand = "TestBrand", GenericName = "TestGeneric" };

        var id = await _service.CreateMedication(input);
        var fromDb = await _context.Medications.FindAsync(id);

        Assert.Multiple(() =>
        {
            Assert.That(id, Is.GreaterThan(0));
            Assert.That(fromDb!.Name, Is.EqualTo("TestMed"));
            Assert.That(fromDb.Brand, Is.EqualTo("TestBrand"));
        });
    }
}
