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
public class MissingStorageServiceTests
{
    private Mock<HospitalContext> _contextMock = null!;
    private Mock<IMapper> _mapperMock = null!;

    private static readonly DateTime Ts = new DateTime(2025, 6, 1, 10, 0, 0);

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
            .Setup(m => m.Map<IEnumerable<MedicationStorageMissingOutput>>(It.IsAny<object>()))
            .Returns((object src) =>
                ((IEnumerable<MedicationStorageMissing>)src).Select(m => new MedicationStorageMissingOutput
                {
                    Id = m.Id,
                    FkMedicationStorageId = m.FkMedicationStorageId,
                    AmountMissing = m.AmountMissing,
                    WentMissingAt = m.WentMissingAt,
                }));

        _mapperMock
            .Setup(m => m.Map<MedicationStorageMissingOutput>(It.IsAny<MedicationStorageMissing>()))
            .Returns((MedicationStorageMissing m) => new MedicationStorageMissingOutput
            {
                Id = m.Id,
                FkMedicationStorageId = m.FkMedicationStorageId,
                AmountMissing = m.AmountMissing,
                WentMissingAt = m.WentMissingAt,
            });

        _mapperMock
            .Setup(m => m.Map<MedicationStorageMissing>(It.IsAny<MedicationStorageMissingInput>()))
            .Returns((MedicationStorageMissingInput i) => new MedicationStorageMissing
            {
                FkMedicationStorageId = i.FkMedicationStorageId,
                AmountMissing = i.AmountMissing,
                WentMissingAt = i.WentMissingAt,
            });
    }

    private List<MedicationStorageMissing> ThreeRecords() =>
    [
        new MedicationStorageMissing { Id = 1, FkMedicationStorageId = 10, AmountMissing = 5.0, WentMissingAt = Ts },
        new MedicationStorageMissing { Id = 2, FkMedicationStorageId = 20, AmountMissing = 12.5, WentMissingAt = Ts.AddDays(1) },
        new MedicationStorageMissing { Id = 3, FkMedicationStorageId = 10, AmountMissing = 3.0, WentMissingAt = Ts.AddDays(2) },
    ];

    private MissingStorageService BuildService(List<MedicationStorageMissing> records)
    {
        var dbSetMock = MockDbSetHelper.Create(records);
        _contextMock.Setup(c => c.MedicationStorageMissings).Returns(dbSetMock.Object);
        return new MissingStorageService(_contextMock.Object, _mapperMock.Object);
    }

    // GetAll

    [Test]
    public async Task GetAll_ReturnsAllMissingRecords()
    {
        var service = BuildService(ThreeRecords());

        var result = (await service.GetAll()).ToList();

        Assert.That(result, Has.Count.EqualTo(3));
    }

    // GetOne

    [Test]
    public async Task GetOne_WithValidId_ReturnsCorrectRecord()
    {
        var service = BuildService(ThreeRecords());

        var result = await service.GetOne(2);

        Assert.That(result, Is.Not.Null);
        Assert.That(result!.AmountMissing, Is.EqualTo(12.5));
        Assert.That(result.FkMedicationStorageId, Is.EqualTo(20));
    }

    [Test]
    public async Task GetOne_WithInvalidId_ReturnsNull()
    {
        var service = BuildService(ThreeRecords());

        var result = await service.GetOne(999);

        Assert.That(result, Is.Null);
    }

    // CreateMissingStorage

    [Test]
    public async Task CreateMissingStorage_WithValidInput_CallsAddAndSave()
    {
        var records = new List<MedicationStorageMissing>();
        var dbSetMock = MockDbSetHelper.Create(records);
        _contextMock.Setup(c => c.MedicationStorageMissings).Returns(dbSetMock.Object);
        var service = new MissingStorageService(_contextMock.Object, _mapperMock.Object);

        var input = new MedicationStorageMissingInput
        {
            FkMedicationStorageId = 5,
            AmountMissing = 8.0,
            WentMissingAt = Ts,
        };
        var result = await service.CreateMissingStorage(input);

        Assert.That(result, Is.GreaterThanOrEqualTo(0));
        dbSetMock.Verify(d => d.AddAsync(It.IsAny<MedicationStorageMissing>(), It.IsAny<CancellationToken>()), Times.Once);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    // EditMissingStorage

    [Test]
    public async Task EditMissingStorage_WithValidId_UpdatesFieldsAndReturnsTrue()
    {
        var record = new MedicationStorageMissing
        {
            Id = 1,
            FkMedicationStorageId = 10,
            AmountMissing = 5.0,
            WentMissingAt = Ts,
        };
        var service = BuildService([record]);

        var input = new MedicationStorageMissingInput
        {
            FkMedicationStorageId = 99,
            AmountMissing = 20.0,
            WentMissingAt = Ts.AddDays(5),
        };
        var result = await service.EditMissingStorage(1, input);

        Assert.That(result, Is.True);
        Assert.That(record.AmountMissing, Is.EqualTo(20.0));
        Assert.That(record.FkMedicationStorageId, Is.EqualTo(99));
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public async Task EditMissingStorage_WithInvalidId_ReturnsFalseWithoutSaving()
    {
        var service = BuildService([]);

        var result = await service.EditMissingStorage(999, new MedicationStorageMissingInput());

        Assert.That(result, Is.False);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    // DeleteMissingStorage

    [Test]
    public async Task DeleteMissingStorage_WithValidId_ReturnsTrueAndRemoves()
    {
        var records = ThreeRecords();
        var dbSetMock = MockDbSetHelper.Create(records);
        _contextMock.Setup(c => c.MedicationStorageMissings).Returns(dbSetMock.Object);
        var service = new MissingStorageService(_contextMock.Object, _mapperMock.Object);

        var result = await service.DeleteMissingStorage(1);

        Assert.That(result, Is.True);
        dbSetMock.Verify(d => d.Remove(It.Is<MedicationStorageMissing>(r => r.Id == 1)), Times.Once);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public async Task DeleteMissingStorage_WithInvalidId_ReturnsFalseWithoutSaving()
    {
        var service = BuildService([]);

        var result = await service.DeleteMissingStorage(999);

        Assert.That(result, Is.False);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }
}
