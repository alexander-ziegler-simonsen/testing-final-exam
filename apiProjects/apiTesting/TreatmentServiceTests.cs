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
public class TreatmentServiceTests
{
    private Mock<HospitalContext> _contextMock = null!;
    private Mock<IMapper> _mapperMock = null!;

    private static readonly DateTime T1 = new DateTime(2025, 1, 1, 8, 0, 0);
    private static readonly DateTime T2 = new DateTime(2025, 1, 2, 8, 0, 0);
    private static readonly DateTime T3 = new DateTime(2025, 1, 3, 8, 0, 0);

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
            .Setup(m => m.Map<IEnumerable<TreatmentOutput>>(It.IsAny<object>()))
            .Returns((object src) =>
                ((IEnumerable<Treatment>)src).Select(t => new TreatmentOutput
                {
                    Id = t.Id,
                    FkPatientId = t.FkPatientId,
                    Description = t.Description,
                    Time = t.Time,
                }));

        _mapperMock
            .Setup(m => m.Map<TreatmentOutput>(It.IsAny<Treatment>()))
            .Returns((Treatment t) => new TreatmentOutput
            {
                Id = t.Id,
                FkPatientId = t.FkPatientId,
                Description = t.Description,
                Time = t.Time,
            });

        _mapperMock
            .Setup(m => m.Map<Treatment>(It.IsAny<TreatmentInput>()))
            .Returns((TreatmentInput i) => new Treatment
            {
                FkPatientId = i.FkPatientId,
                Description = i.Description,
                Time = i.Time,
            });
    }

    private List<Treatment> ThreeTreatments() =>
    [
        new Treatment { Id = 1, FkPatientId = 10, Description = "Alpha", Time = T3 },
        new Treatment { Id = 2, FkPatientId = 20, Description = "Bravo", Time = T1 },
        new Treatment { Id = 3, FkPatientId = 10, Description = "Charlie", Time = T2 },
    ];

    private TreatmentService BuildService(List<Treatment> treatments)
    {
        var dbSetMock = MockDbSetHelper.Create(treatments);
        _contextMock.Setup(c => c.Treatments).Returns(dbSetMock.Object);
        return new TreatmentService(_contextMock.Object, _mapperMock.Object);
    }

    // GetAll – no filter

    [Test]
    public async Task GetAll_WithNoFilter_ReturnsAllTreatments()
    {
        var service = BuildService(ThreeTreatments());

        var result = (await service.GetAll()).ToList();

        Assert.That(result, Has.Count.EqualTo(3));
    }

    // GetAll – filter by Description

    [Test]
    public async Task GetAll_FilterByDescription_ReturnsMatchingTreatments()
    {
        var service = BuildService(ThreeTreatments());

        var result = (await service.GetAll(new TreatmentInput { Description = "alpha" })).ToList();

        Assert.That(result, Has.Count.EqualTo(1));
        Assert.That(result[0].Description, Is.EqualTo("Alpha"));
    }

    [Test]
    public async Task GetAll_FilterByDescription_IsCaseInsensitive()
    {
        var service = BuildService(ThreeTreatments());

        var result = (await service.GetAll(new TreatmentInput { Description = "BRAVO" })).ToList();

        Assert.That(result, Has.Count.EqualTo(1));
        Assert.That(result[0].Description, Is.EqualTo("Bravo"));
    }

    // GetAll – filter by FkPatientId

    [Test]
    public async Task GetAll_FilterByPatientId_ReturnsMatchingTreatments()
    {
        var service = BuildService(ThreeTreatments());

        var result = (await service.GetAll(new TreatmentInput { FkPatientId = 10 })).ToList();

        Assert.That(result, Has.Count.EqualTo(2));
        Assert.That(result.All(t => t.FkPatientId == 10), Is.True);
    }

    [Test]
    public async Task GetAll_FilterByPatientId_WhenZero_ReturnsAll()
    {
        var service = BuildService(ThreeTreatments());

        // FkPatientId == 0 is the "no filter" sentinel
        var result = (await service.GetAll(new TreatmentInput { FkPatientId = 0 })).ToList();

        Assert.That(result, Has.Count.EqualTo(3));
    }

    // GetAll – sort

    [TestCase("description", "asc", new[] { "Alpha", "Bravo", "Charlie" })]
    [TestCase("description", "desc", new[] { "Charlie", "Bravo", "Alpha" })]
    public async Task GetAll_SortByDescription_ReturnsCorrectOrder(
        string sortBy, string sortDir, string[] expected)
    {
        var service = BuildService(ThreeTreatments());

        var result = (await service.GetAll(sortBy: sortBy, sortDir: sortDir))
            .Select(t => t.Description)
            .ToList();

        Assert.That(result, Is.EqualTo(expected));
    }

    [Test]
    public async Task GetAll_SortByTimeAsc_ReturnsChronologicalOrder()
    {
        var service = BuildService(ThreeTreatments());

        var result = (await service.GetAll(sortBy: "time", sortDir: "asc"))
            .Select(t => t.Id)
            .ToList();

        Assert.That(result, Is.EqualTo(new[] { 2, 3, 1 })); // T1, T2, T3
    }

    [Test]
    public async Task GetAll_UnknownSortBy_DefaultsSortById()
    {
        var unordered = new List<Treatment>
        {
            new Treatment { Id = 3, FkPatientId = 10, Description = "Z", Time = T1 },
            new Treatment { Id = 1, FkPatientId = 10, Description = "A", Time = T2 },
            new Treatment { Id = 2, FkPatientId = 10, Description = "M", Time = T3 },
        };
        var service = BuildService(unordered);

        var result = (await service.GetAll(sortBy: "unknown"))
            .Select(t => t.Id)
            .ToList();

        Assert.That(result, Is.EqualTo(new[] { 1, 2, 3 }));
    }

    // GetOne

    [Test]
    public async Task GetOne_WithValidId_ReturnsCorrectTreatment()
    {
        var service = BuildService(ThreeTreatments());

        var result = await service.GetOne(2);

        Assert.That(result, Is.Not.Null);
        Assert.That(result!.Description, Is.EqualTo("Bravo"));
        Assert.That(result.FkPatientId, Is.EqualTo(20));
    }

    [Test]
    public async Task GetOne_WithInvalidId_ReturnsNull()
    {
        var service = BuildService(ThreeTreatments());

        var result = await service.GetOne(999);

        Assert.That(result, Is.Null);
    }

    // EditTreatment

    [Test]
    public async Task EditTreatment_WithValidId_UpdatesFieldsAndReturnsTrue()
    {
        var treatment = new Treatment { Id = 1, FkPatientId = 10, Description = "Old", Time = T1 };
        var service = BuildService([treatment]);

        var input = new TreatmentInput { FkPatientId = 99, Description = "Updated", Time = T3 };
        var result = await service.EditTreatment(1, input);

        Assert.That(result, Is.True);
        Assert.That(treatment.Description, Is.EqualTo("Updated"));
        Assert.That(treatment.FkPatientId, Is.EqualTo(99));
        Assert.That(treatment.Time, Is.EqualTo(T3));
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public async Task EditTreatment_WithInvalidId_ReturnsFalseWithoutSaving()
    {
        var service = BuildService([]);

        var result = await service.EditTreatment(999, new TreatmentInput());

        Assert.That(result, Is.False);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    // DeleteTreatment

    [Test]
    public async Task DeleteTreatment_WithValidId_ReturnsTrueAndRemoves()
    {
        var treatments = ThreeTreatments();
        var dbSetMock = MockDbSetHelper.Create(treatments);
        _contextMock.Setup(c => c.Treatments).Returns(dbSetMock.Object);
        var service = new TreatmentService(_contextMock.Object, _mapperMock.Object);

        var result = await service.DeleteTreatment(1);

        Assert.That(result, Is.True);
        dbSetMock.Verify(d => d.Remove(It.Is<Treatment>(t => t.Id == 1)), Times.Once);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public async Task DeleteTreatment_WithInvalidId_ReturnsFalseWithoutSaving()
    {
        var service = BuildService([]);

        var result = await service.DeleteTreatment(999);

        Assert.That(result, Is.False);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    // CreateTreatment

    [Test]
    public async Task CreateTreatment_WithValidInput_CallsAddAndSave()
    {
        var treatments = new List<Treatment>();
        var dbSetMock = MockDbSetHelper.Create(treatments);
        _contextMock.Setup(c => c.Treatments).Returns(dbSetMock.Object);
        var service = new TreatmentService(_contextMock.Object, _mapperMock.Object);

        var input = new TreatmentInput { FkPatientId = 5, Description = "New", Time = T1 };
        await service.CreateTreatment(input);

        dbSetMock.Verify(d => d.AddAsync(It.IsAny<Treatment>(), It.IsAny<CancellationToken>()), Times.Once);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
