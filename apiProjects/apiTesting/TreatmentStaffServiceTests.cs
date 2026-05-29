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
public class TreatmentStaffServiceTests
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

    private TreatmentStaffService BuildService(List<TreatmentStaff> items)
    {
        var dbSetMock = MockDbSetHelper.Create(items);
        _contextMock.Setup(c => c.TreatmentStaffs).Returns(dbSetMock.Object);

        _mapperMock
            .Setup(m => m.Map<IEnumerable<TreatmentStaffOutput>>(It.IsAny<object>()))
            .Returns((object src) =>
                ((IEnumerable<TreatmentStaff>)src).Select(ts => new TreatmentStaffOutput
                {
                    Id = ts.Id,
                    FkTreatmentId = ts.FkTreatmentId,
                    FkStaffId = ts.FkStaffId,
                }));

        _mapperMock
            .Setup(m => m.Map<TreatmentStaffOutput>(It.IsAny<TreatmentStaff>()))
            .Returns((TreatmentStaff ts) => new TreatmentStaffOutput
            {
                Id = ts.Id,
                FkTreatmentId = ts.FkTreatmentId,
                FkStaffId = ts.FkStaffId,
            });

        _mapperMock
            .Setup(m => m.Map<TreatmentStaff>(It.IsAny<TreatmentStaffInput>()))
            .Returns((TreatmentStaffInput input) => new TreatmentStaff
            {
                FkTreatmentId = input.FkTreatmentId,
                FkStaffId = input.FkStaffId,
            });

        return new TreatmentStaffService(_contextMock.Object, _mapperMock.Object);
    }

    private List<TreatmentStaff> ThreeAssignments() =>
    [
        new() { Id = 1, FkTreatmentId = 10, FkStaffId = 100 },
        new() { Id = 2, FkTreatmentId = 20, FkStaffId = 200 },
        new() { Id = 3, FkTreatmentId = 30, FkStaffId = 300 },
    ];

    // GetAll

    [Test]
    public async Task GetAll_ReturnsAllAssignments()
    {
        var service = BuildService(ThreeAssignments());

        var result = (await service.GetAll()).ToList();

        Assert.That(result, Has.Count.EqualTo(3));
    }

    [Test]
    public async Task GetAll_EmptyStore_ReturnsEmptyList()
    {
        var service = BuildService([]);

        var result = (await service.GetAll()).ToList();

        Assert.That(result, Is.Empty);
    }

    [Test]
    public async Task GetAll_MapsFieldsCorrectly()
    {
        var service = BuildService(ThreeAssignments());

        var result = (await service.GetAll()).First();

        Assert.That(result.FkTreatmentId, Is.EqualTo(10));
        Assert.That(result.FkStaffId, Is.EqualTo(100));
    }

    // GetOne

    [TestCase(1, 10, 100)]
    [TestCase(2, 20, 200)]
    public async Task GetOne_ExistingId_ReturnsMappedOutput(int id, int treatmentId, int staffId)
    {
        var service = BuildService(ThreeAssignments());

        var result = await service.GetOne(id);

        Assert.That(result, Is.Not.Null);
        Assert.That(result!.FkTreatmentId, Is.EqualTo(treatmentId));
        Assert.That(result.FkStaffId, Is.EqualTo(staffId));
    }

    [Test]
    public async Task GetOne_NonExistentId_ReturnsNull()
    {
        var service = BuildService(ThreeAssignments());

        var result = await service.GetOne(999);

        Assert.That(result, Is.Null);
    }

    // CreateTreatmentStaff

    [Test]
    public async Task CreateTreatmentStaff_AddsEntityAndSavesChanges()
    {
        var items = new List<TreatmentStaff>();
        var dbSetMock = MockDbSetHelper.Create(items);
        _contextMock.Setup(c => c.TreatmentStaffs).Returns(dbSetMock.Object);
        _mapperMock
            .Setup(m => m.Map<TreatmentStaff>(It.IsAny<TreatmentStaffInput>()))
            .Returns((TreatmentStaffInput input) => new TreatmentStaff
            {
                FkTreatmentId = input.FkTreatmentId,
                FkStaffId = input.FkStaffId,
            });
        var service = new TreatmentStaffService(_contextMock.Object, _mapperMock.Object);

        await service.CreateTreatmentStaff(new TreatmentStaffInput { FkTreatmentId = 5, FkStaffId = 50 });

        dbSetMock.Verify(
            s => s.AddAsync(It.Is<TreatmentStaff>(ts => ts.FkTreatmentId == 5 && ts.FkStaffId == 50), It.IsAny<CancellationToken>()),
            Times.Once);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    // EditTreatmentStaff

    [Test]
    public async Task EditTreatmentStaff_WhenExists_UpdatesFieldsAndReturnsTrue()
    {
        var ts = new TreatmentStaff { Id = 1, FkTreatmentId = 10, FkStaffId = 100 };
        var service = BuildService([ts]);
        var input = new TreatmentStaffInput { FkTreatmentId = 99, FkStaffId = 999 };

        var result = await service.EditTreatmentStaff(1, input);

        Assert.That(result, Is.True);
        Assert.That(ts.FkTreatmentId, Is.EqualTo(99));
        Assert.That(ts.FkStaffId, Is.EqualTo(999));
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public async Task EditTreatmentStaff_WhenNotFound_ReturnsFalseWithoutSaving()
    {
        var service = BuildService([]);

        var result = await service.EditTreatmentStaff(99, new TreatmentStaffInput());

        Assert.That(result, Is.False);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    // DeleteTreatmentStaff

    [Test]
    public async Task DeleteTreatmentStaff_WhenExists_ReturnsTrueAndSavesChanges()
    {
        var items = ThreeAssignments();
        var dbSetMock = MockDbSetHelper.Create(items);
        _contextMock.Setup(c => c.TreatmentStaffs).Returns(dbSetMock.Object);
        _mapperMock.Setup(m => m.Map<TreatmentStaffOutput>(It.IsAny<TreatmentStaff>())).Returns(new TreatmentStaffOutput());
        var service = new TreatmentStaffService(_contextMock.Object, _mapperMock.Object);

        var result = await service.DeleteTreatmentStaff(2);

        Assert.That(result, Is.True);
        dbSetMock.Verify(s => s.Remove(It.Is<TreatmentStaff>(ts => ts.Id == 2)), Times.Once);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public async Task DeleteTreatmentStaff_WhenNotFound_ReturnsFalseWithoutSaving()
    {
        var service = BuildService([]);

        var result = await service.DeleteTreatmentStaff(99);

        Assert.That(result, Is.False);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }
}
