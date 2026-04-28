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
public class PatientServiceTests
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
        _mapperMock = new Mock<IMapper>();

        _contextMock
            .Setup(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);
    }

    private PatientService BuildService(List<Patient> patients)
    {
        var dbSetMock = MockDbSetHelper.Create(patients);
        _contextMock.Setup(c => c.Patients).Returns(dbSetMock.Object);

        // Mapper: List → List (preserves order so sorting tests are meaningful)
        _mapperMock
            .Setup(m => m.Map<List<PatientOutput>>(It.IsAny<object>()))
            .Returns((object src) =>
                ((IEnumerable<Patient>)src)
                .Select(p => new PatientOutput
                {
                    Id = p.Id,
                    Firstname = p.Firstname,
                    Lastname = p.Lastname,
                    Gender = p.Gender,
                    CprNumber = p.CprNumber,
                }).ToList());

        // Mapper: single entity
        _mapperMock
            .Setup(m => m.Map<PatientOutput>(It.IsAny<Patient>()))
            .Returns((Patient p) => new PatientOutput
            {
                Id = p.Id,
                Firstname = p.Firstname,
                Lastname = p.Lastname,
                Gender = p.Gender,
                CprNumber = p.CprNumber,
            });

        return new PatientService(_contextMock.Object, _mapperMock.Object);
    }

    // GetAll – filtering

    [Test]
    public async Task GetAll_WithNoFilter_ReturnsAllPatients()
    {
        var patients = new List<Patient>
        {
            new() { Id = 1, Firstname = "Alice", Lastname = "Smith" },
            new() { Id = 2, Firstname = "Bob",   Lastname = "Jones" },
        };
        var service = BuildService(patients);

        var result = (await service.GetAll()).ToList();

        Assert.That(result, Has.Count.EqualTo(2));
    }

    [Test]
    public async Task GetAll_WithFirstnameFilter_ReturnsMatchingPatients()
    {
        var patients = new List<Patient>
        {
            new() { Id = 1, Firstname = "Alice" },
            new() { Id = 2, Firstname = "Bob"   },
            new() { Id = 3, Firstname = "Albert" },
        };
        var service = BuildService(patients);

        var result = (await service.GetAll(new PatientInput { Firstname = "al" })).ToList();

        Assert.That(result, Has.Count.EqualTo(2));
        Assert.That(result.Select(p => p.Id), Is.EquivalentTo(new[] { 1, 3 }));
    }

    [Test]
    public async Task GetAll_WithFirstnameFilter_IsCaseInsensitive()
    {
        var patients = new List<Patient>
        {
            new() { Id = 1, Firstname = "Alice" },
            new() { Id = 2, Firstname = "BOB"   },
        };
        var service = BuildService(patients);

        var result = (await service.GetAll(new PatientInput { Firstname = "alice" })).ToList();

        Assert.That(result, Has.Count.EqualTo(1));
        Assert.That(result[0].Id, Is.EqualTo(1));
    }

    [Test]
    public async Task GetAll_WithGenderFilter_ReturnsMatchingPatients()
    {
        var patients = new List<Patient>
        {
            new() { Id = 1, Firstname = "Alice", Gender = "Female" },
            new() { Id = 2, Firstname = "Bob",   Gender = "Male"   },
        };
        var service = BuildService(patients);

        var result = (await service.GetAll(new PatientInput { Gender = "female" })).ToList();

        Assert.That(result, Has.Count.EqualTo(1));
        Assert.That(result[0].Firstname, Is.EqualTo("Alice"));
    }

    [Test]
    public async Task GetAll_WithNonMatchingFilter_ReturnsEmpty()
    {
        var patients = new List<Patient>
        {
            new() { Id = 1, Firstname = "Alice" },
        };
        var service = BuildService(patients);

        var result = (await service.GetAll(new PatientInput { Firstname = "xyz" })).ToList();

        Assert.That(result, Is.Empty);
    }

    // GetAll – sorting

    [Test]
    public async Task GetAll_SortByFirstnameAsc_ReturnsSortedResults()
    {
        var patients = new List<Patient>
        {
            new() { Id = 2, Firstname = "Charlie" },
            new() { Id = 1, Firstname = "Alice"   },
            new() { Id = 3, Firstname = "Bob"     },
        };
        var service = BuildService(patients);

        var result = (await service.GetAll(sortBy: "firstname", sortDir: "asc"))
            .Select(p => p.Firstname).ToList();

        Assert.That(result, Is.EqualTo(new[] { "Alice", "Bob", "Charlie" }));
    }

    [Test]
    public async Task GetAll_SortByFirstnameDesc_ReturnsSortedResults()
    {
        var patients = new List<Patient>
        {
            new() { Id = 1, Firstname = "Alice"   },
            new() { Id = 2, Firstname = "Charlie" },
            new() { Id = 3, Firstname = "Bob"     },
        };
        var service = BuildService(patients);

        var result = (await service.GetAll(sortBy: "firstname", sortDir: "desc"))
            .Select(p => p.Firstname).ToList();

        Assert.That(result, Is.EqualTo(new[] { "Charlie", "Bob", "Alice" }));
    }

    [Test]
    public async Task GetAll_WithUnknownSortBy_DefaultSortsByIdAsc()
    {
        var patients = new List<Patient>
        {
            new() { Id = 3, Firstname = "Alice"   },
            new() { Id = 1, Firstname = "Charlie" },
            new() { Id = 2, Firstname = "Bob"     },
        };
        var service = BuildService(patients);

        var result = (await service.GetAll(sortBy: "unknown"))
            .Select(p => p.Id).ToList();

        Assert.That(result, Is.EqualTo(new[] { 1, 2, 3 }));
    }

    // GetOne

    [Test]
    public async Task GetOne_WhenPatientExists_ReturnsMappedOutput()
    {
        var patients = new List<Patient>
        {
            new() { Id = 1, Firstname = "Alice", Lastname = "Smith" },
        };
        var service = BuildService(patients);

        var result = await service.GetOne(1);

        Assert.That(result, Is.Not.Null);
        Assert.That(result!.Firstname, Is.EqualTo("Alice"));
    }

    [Test]
    public async Task GetOne_WhenPatientNotFound_ReturnsNull()
    {
        var service = BuildService(new List<Patient>());

        var result = await service.GetOne(99);

        Assert.That(result, Is.Null);
    }

    // DeletePatient

    [Test]
    public async Task DeletePatient_WhenPatientExists_ReturnsTrueAndSavesChanges()
    {
        var patients = new List<Patient>
        {
            new() { Id = 1, Firstname = "Alice" },
        };
        var dbSetMock = MockDbSetHelper.Create(patients);
        _contextMock.Setup(c => c.Patients).Returns(dbSetMock.Object);
        _mapperMock.Setup(m => m.Map<PatientOutput>(It.IsAny<Patient>()))
            .Returns(new PatientOutput());
        var service = new PatientService(_contextMock.Object, _mapperMock.Object);

        var result = await service.DeletePatient(1);

        Assert.That(result, Is.True);
        dbSetMock.Verify(s => s.Remove(It.Is<Patient>(p => p.Id == 1)), Times.Once);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public async Task DeletePatient_WhenPatientNotFound_ReturnsFalseWithoutSaving()
    {
        var service = BuildService(new List<Patient>());

        var result = await service.DeletePatient(99);

        Assert.That(result, Is.False);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    // EditPatient

    [Test]
    public async Task EditPatient_WhenPatientExists_UpdatesPropertiesAndReturnsTrue()
    {
        var patient = new Patient { Id = 1, Firstname = "Old", Lastname = "Name" };
        var service = BuildService(new List<Patient> { patient });
        var input = new PatientInput { Firstname = "New", Lastname = "Updated", Gender = "Female", CprNumber = "1234" };

        var result = await service.EditPatient(1, input);

        Assert.That(result, Is.True);
        Assert.That(patient.Firstname, Is.EqualTo("New"));
        Assert.That(patient.Lastname, Is.EqualTo("Updated"));
        Assert.That(patient.Gender, Is.EqualTo("Female"));
        Assert.That(patient.CprNumber, Is.EqualTo("1234"));
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public async Task EditPatient_WhenPatientNotFound_ReturnsFalseWithoutSaving()
    {
        var service = BuildService(new List<Patient>());
        var input = new PatientInput { Firstname = "New" };

        var result = await service.EditPatient(99, input);

        Assert.That(result, Is.False);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }
}
