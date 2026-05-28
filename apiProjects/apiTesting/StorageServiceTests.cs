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
public class StorageServiceTests
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
            .Setup(m => m.Map<IEnumerable<MedicationStorageOutput>>(It.IsAny<object>()))
            .Returns((object src) =>
                ((IEnumerable<MedicationStorage>)src).Select(s => new MedicationStorageOutput
                {
                    Id = s.Id,
                    FkMedicationId = s.FkMedicationId,
                    Amount = s.Amount,
                }));

        _mapperMock
            .Setup(m => m.Map<MedicationStorageOutput>(It.IsAny<MedicationStorage>()))
            .Returns((MedicationStorage s) => new MedicationStorageOutput
            {
                Id = s.Id,
                FkMedicationId = s.FkMedicationId,
                Amount = s.Amount,
            });

        _mapperMock
            .Setup(m => m.Map<MedicationStorage>(It.IsAny<MedicationStorageInput>()))
            .Returns((MedicationStorageInput i) => new MedicationStorage
            {
                FkMedicationId = i.FkMedicationId,
                Amount = i.Amount,
            });
    }

    private List<MedicationStorage> ThreeStorages() =>
    [
        new MedicationStorage { Id = 1, FkMedicationId = 101, Amount = 50.0 },
        new MedicationStorage { Id = 2, FkMedicationId = 102, Amount = 20.0 },
        new MedicationStorage { Id = 3, FkMedicationId = 103, Amount = 0.0 },
    ];

    private StorageService BuildService(List<MedicationStorage> storages)
    {
        var dbSetMock = MockDbSetHelper.Create(storages);
        _contextMock.Setup(c => c.MedicationStorages).Returns(dbSetMock.Object);
        return new StorageService(_contextMock.Object, _mapperMock.Object);
    }

    // GetAll

    [Test]
    public async Task GetAll_ReturnsAllStorageRecords()
    {
        var service = BuildService(ThreeStorages());

        var result = (await service.GetAll()).ToList();

        Assert.That(result, Has.Count.EqualTo(3));
    }

    // GetOne

    [Test]
    public async Task GetOne_WithValidId_ReturnsCorrectStorage()
    {
        var service = BuildService(ThreeStorages());

        var result = await service.GetOne(2);

        Assert.That(result, Is.Not.Null);
        Assert.That(result!.Amount, Is.EqualTo(20.0));
        Assert.That(result.FkMedicationId, Is.EqualTo(102));
    }

    [Test]
    public async Task GetOne_WithInvalidId_ReturnsNull()
    {
        var service = BuildService(ThreeStorages());

        var result = await service.GetOne(999);

        Assert.That(result, Is.Null);
    }

    // EditStorage – core of R-10: stock deduction

    [Test]
    public async Task EditStorage_WithValidId_UpdatesAmountAndReturnsTrue()
    {
        var storage = new MedicationStorage { Id = 1, FkMedicationId = 101, Amount = 50.0 };
        var service = BuildService([storage]);

        var input = new MedicationStorageInput { FkMedicationId = 101, Amount = 35.0 };
        var result = await service.EditStorage(1, input);

        Assert.That(result, Is.True);
        Assert.That(storage.Amount, Is.EqualTo(35.0));
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public async Task EditStorage_WithValidId_UpdatesMedicationId()
    {
        var storage = new MedicationStorage { Id = 1, FkMedicationId = 101, Amount = 10.0 };
        var service = BuildService([storage]);

        var input = new MedicationStorageInput { FkMedicationId = 999, Amount = 10.0 };
        await service.EditStorage(1, input);

        Assert.That(storage.FkMedicationId, Is.EqualTo(999));
    }

    [Test]
    public async Task EditStorage_StockDeduction_CorrectlyReducesAmount()
    {
        // R-10: submitting a missing report calls EditStorage to deduct stock
        const double initialAmount = 100.0;
        const double missingAmount = 15.0;
        var storage = new MedicationStorage { Id = 1, FkMedicationId = 101, Amount = initialAmount };
        var service = BuildService([storage]);

        var input = new MedicationStorageInput
        {
            FkMedicationId = 101,
            Amount = initialAmount - missingAmount,
        };
        await service.EditStorage(1, input);

        Assert.That(storage.Amount, Is.EqualTo(initialAmount - missingAmount));
    }

    [Test]
    public async Task EditStorage_WithInvalidId_ReturnsFalseWithoutSaving()
    {
        var service = BuildService([]);

        var result = await service.EditStorage(999, new MedicationStorageInput());

        Assert.That(result, Is.False);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    // DeleteStorage

    [Test]
    public async Task DeleteStorage_WithValidId_ReturnsTrueAndRemoves()
    {
        var storages = ThreeStorages();
        var dbSetMock = MockDbSetHelper.Create(storages);
        _contextMock.Setup(c => c.MedicationStorages).Returns(dbSetMock.Object);
        var service = new StorageService(_contextMock.Object, _mapperMock.Object);

        var result = await service.DeleteStorage(1);

        Assert.That(result, Is.True);
        dbSetMock.Verify(d => d.Remove(It.Is<MedicationStorage>(s => s.Id == 1)), Times.Once);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public async Task DeleteStorage_WithInvalidId_ReturnsFalseWithoutSaving()
    {
        var service = BuildService([]);

        var result = await service.DeleteStorage(999);

        Assert.That(result, Is.False);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    // CreateStorage

    [Test]
    public async Task CreateStorage_WithValidInput_CallsAddAndSave()
    {
        var storages = new List<MedicationStorage>();
        var dbSetMock = MockDbSetHelper.Create(storages);
        _contextMock.Setup(c => c.MedicationStorages).Returns(dbSetMock.Object);
        var service = new StorageService(_contextMock.Object, _mapperMock.Object);

        var result = await service.CreateStorage(new MedicationStorageInput { FkMedicationId = 5, Amount = 99.0 });

        Assert.That(result, Is.GreaterThanOrEqualTo(0));
        dbSetMock.Verify(d => d.AddAsync(It.IsAny<MedicationStorage>(), It.IsAny<CancellationToken>()), Times.Once);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
