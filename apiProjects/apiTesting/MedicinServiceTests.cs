using AutoMapper;
using hospitalApi.Data;
using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;
using hospitalApi.Models;
using hospitalApi.Services;
using hospitalApiTesting.Helpers;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace hospitalApiTesting;

[TestFixture]
public class MedicinServiceTests
{
    private Mock<HospitalContext> _contextMock = null!;
    private Mock<IMapper> _mapperMock = null!;

    [SetUp]
    public void SetUp()
    {
        var options = new DbContextOptionsBuilder<HospitalContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _contextMock = new Mock<HospitalContext>(options);
        _contextMock
            .Setup(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        _mapperMock = new Mock<IMapper>();
        _mapperMock
            .Setup(m => m.Map<IEnumerable<MedicationOutput>>(It.IsAny<object>()))
            .Returns((object src) =>
                ((IEnumerable<Medication>)src).Select(m => new MedicationOutput
                {
                    Id = m.Id,
                    Name = m.Name,
                    GenericName = m.GenericName,
                    Brand = m.Brand,
                    Form = m.Form,
                    Strength = m.Strength,
                    Category = m.Category,
                    Description = m.Description,
                }));

        _mapperMock
            .Setup(m => m.Map<MedicationOutput>(It.IsAny<Medication>()))
            .Returns((Medication m) => new MedicationOutput
            {
                Id = m.Id,
                Name = m.Name,
                GenericName = m.GenericName,
                Brand = m.Brand,
            });

        _mapperMock
            .Setup(m => m.Map<Medication>(It.IsAny<MedicationInput>()))
            .Returns((MedicationInput i) => new Medication
            {
                Name = i.Name,
                GenericName = i.GenericName,
                Brand = i.Brand,
            });
    }

    private List<Medication> ThreeMeds() =>
    [
        new Medication { Id = 1, Name = "Paracetamol", GenericName = "Acetaminophen", Brand = "Panodil", Form = "Tablet", Strength = "500mg", Category = "Analgesic", Description = "Pain relief" },
        new Medication { Id = 2, Name = "Ibuprofen",   GenericName = "Ibuprofen",     Brand = "Advil",   Form = "Tablet", Strength = "200mg", Category = "NSAID",     Description = "Anti-inflammatory" },
        new Medication { Id = 3, Name = "Amoxicillin", GenericName = "Amoxicillin",   Brand = "Amoxil",  Form = "Capsule", Strength = "250mg", Category = "Antibiotic", Description = "Antibiotic" },
    ];

    private MedicinService BuildService(List<Medication> meds)
    {
        var dbSetMock = MockDbSetHelper.Create(meds);
        _contextMock.Setup(c => c.Medications).Returns(dbSetMock.Object);
        return new MedicinService(_contextMock.Object, _mapperMock.Object);
    }

    // GetAll

    [Test]
    public async Task GetAll_ReturnsAllMedications()
    {
        var service = BuildService(ThreeMeds());

        var result = (await service.GetAll()).ToList();

        Assert.That(result, Has.Count.EqualTo(3));
    }

    // GetOne

    [Test]
    public async Task GetOne_WithValidId_ReturnsCorrectMedication()
    {
        var service = BuildService(ThreeMeds());

        var result = await service.GetOne(2);

        Assert.That(result, Is.Not.Null);
        Assert.That(result!.Name, Is.EqualTo("Ibuprofen"));
    }

    [Test]
    public async Task GetOne_WithInvalidId_ReturnsNull()
    {
        var service = BuildService(ThreeMeds());

        var result = await service.GetOne(999);

        Assert.That(result, Is.Null);
    }

    // EditMedication

    [Test]
    public async Task EditMedication_WithValidId_UpdatesAllFieldsAndReturnsTrue()
    {
        var med = new Medication
        {
            Id = 1,
            Name = "Old",
            GenericName = "OldGeneric",
            Brand = "OldBrand",
            Form = "Tablet",
            Strength = "100mg",
            Category = "OldCat",
            Description = "Old desc",
        };
        var service = BuildService([med]);

        var input = new MedicationInput
        {
            Name = "New",
            GenericName = "NewGeneric",
            Brand = "NewBrand",
            Form = "Capsule",
            Strength = "200mg",
            Category = "NewCat",
            Description = "New desc",
        };
        var result = await service.EditMedication(1, input);

        Assert.That(result, Is.True);
        Assert.That(med.Name, Is.EqualTo("New"));
        Assert.That(med.GenericName, Is.EqualTo("NewGeneric"));
        Assert.That(med.Brand, Is.EqualTo("NewBrand"));
        Assert.That(med.Form, Is.EqualTo("Capsule"));
        Assert.That(med.Strength, Is.EqualTo("200mg"));
        Assert.That(med.Category, Is.EqualTo("NewCat"));
        Assert.That(med.Description, Is.EqualTo("New desc"));
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public async Task EditMedication_WithInvalidId_ReturnsFalseWithoutSaving()
    {
        var service = BuildService([]);

        var result = await service.EditMedication(999, new MedicationInput());

        Assert.That(result, Is.False);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    // DeleteMedication

    [Test]
    public async Task DeleteMedication_WithValidId_ReturnsTrueAndRemoves()
    {
        var meds = ThreeMeds();
        var dbSetMock = MockDbSetHelper.Create(meds);
        _contextMock.Setup(c => c.Medications).Returns(dbSetMock.Object);
        var service = new MedicinService(_contextMock.Object, _mapperMock.Object);

        var result = await service.DeleteMedication(3);

        Assert.That(result, Is.True);
        dbSetMock.Verify(d => d.Remove(It.Is<Medication>(m => m.Id == 3)), Times.Once);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public async Task DeleteMedication_WithInvalidId_ReturnsFalseWithoutSaving()
    {
        var service = BuildService([]);

        var result = await service.DeleteMedication(999);

        Assert.That(result, Is.False);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    // CreateMedication

    [Test]
    public async Task CreateMedication_WithValidInput_CallsAddAndSave()
    {
        var meds = new List<Medication>();
        var dbSetMock = MockDbSetHelper.Create(meds);
        _contextMock.Setup(c => c.Medications).Returns(dbSetMock.Object);
        var service = new MedicinService(_contextMock.Object, _mapperMock.Object);

        var result = await service.CreateMedication(new MedicationInput { Name = "TestMed", Brand = "TestBrand" });

        Assert.That(result, Is.GreaterThanOrEqualTo(0));
        dbSetMock.Verify(d => d.AddAsync(It.IsAny<Medication>(), It.IsAny<CancellationToken>()), Times.Once);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
