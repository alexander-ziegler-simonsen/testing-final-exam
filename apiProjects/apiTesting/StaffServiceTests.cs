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
public class StaffServiceTests
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
            .Setup(m => m.Map<List<StaffOutput>>(It.IsAny<object>()))
            .Returns((object src) =>
                ((IEnumerable<Staff>)src).Select(s => new StaffOutput
                {
                    Id = s.Id,
                    Firstname = s.Firstname,
                    Lastname = s.Lastname,
                    FkRoleId = s.FkRoleId,
                }).ToList());

        _mapperMock
            .Setup(m => m.Map<StaffOutput>(It.IsAny<Staff>()))
            .Returns((Staff s) => new StaffOutput
            {
                Id = s.Id,
                Firstname = s.Firstname,
                Lastname = s.Lastname,
                FkRoleId = s.FkRoleId,
            });
    }

    private List<Staff> ThreeStaff() =>
    [
        new Staff { Id = 1, Firstname = "Alice",   Lastname = "Adams",   FkRoleId = 1 },
        new Staff { Id = 2, Firstname = "Bob",     Lastname = "Brown",   FkRoleId = 2 },
        new Staff { Id = 3, Firstname = "Charlie", Lastname = "Collins", FkRoleId = 1 },
    ];

    private StaffService BuildService(List<Staff> staff)
    {
        var dbSetMock = MockDbSetHelper.Create(staff);
        _contextMock.Setup(c => c.Staff).Returns(dbSetMock.Object);
        return new StaffService(_contextMock.Object, _mapperMock.Object);
    }

    // GetAll

    [Test]
    public async Task GetAll_ReturnsAllStaffMembers()
    {
        var service = BuildService(ThreeStaff());

        var result = (await service.GetAll()).ToList();

        Assert.That(result, Has.Count.EqualTo(3));
    }

    // GetOne

    [Test]
    public async Task GetOne_WithValidId_ReturnsCorrectStaff()
    {
        var service = BuildService(ThreeStaff());

        var result = await service.GetOne(2);

        Assert.That(result, Is.Not.Null);
        Assert.That(result!.Firstname, Is.EqualTo("Bob"));
        Assert.That(result.FkRoleId, Is.EqualTo(2));
    }

    [Test]
    public async Task GetOne_WithInvalidId_ReturnsNull()
    {
        var service = BuildService(ThreeStaff());

        var result = await service.GetOne(999);

        Assert.That(result, Is.Null);
    }

    // EditStaff

    [Test]
    public async Task EditStaff_WithValidId_UpdatesFieldsAndReturnsTrue()
    {
        var staff = new Staff { Id = 1, Firstname = "Alice", Lastname = "Adams", FkRoleId = 1 };
        var service = BuildService([staff]);

        var input = new StaffInput { Firstname = "Alicia", Lastname = "Adams", FkRoleId = 2 };
        var result = await service.EditStaff(1, input);

        Assert.That(result, Is.True);
        Assert.That(staff.Firstname, Is.EqualTo("Alicia"));
        Assert.That(staff.FkRoleId, Is.EqualTo(2));
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public async Task EditStaff_WithInvalidId_ReturnsFalseWithoutSaving()
    {
        var service = BuildService([]);

        var result = await service.EditStaff(999, new StaffInput());

        Assert.That(result, Is.False);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    // DeleteStaff

    [Test]
    public async Task DeleteStaff_WithValidId_ReturnsTrueAndRemoves()
    {
        var staff = ThreeStaff();
        var dbSetMock = MockDbSetHelper.Create(staff);
        _contextMock.Setup(c => c.Staff).Returns(dbSetMock.Object);
        var service = new StaffService(_contextMock.Object, _mapperMock.Object);

        var result = await service.DeleteStaff(2);

        Assert.That(result, Is.True);
        dbSetMock.Verify(d => d.Remove(It.Is<Staff>(s => s.Id == 2)), Times.Once);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public async Task DeleteStaff_WithInvalidId_ReturnsFalseWithoutSaving()
    {
        var service = BuildService([]);

        var result = await service.DeleteStaff(999);

        Assert.That(result, Is.False);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    // CreateStaff

    [Test]
    public async Task CreateStaff_WithValidInput_CallsAddAndSave()
    {
        var staff = new List<Staff>();
        var dbSetMock = MockDbSetHelper.Create(staff);
        _contextMock.Setup(c => c.Staff).Returns(dbSetMock.Object);
        var service = new StaffService(_contextMock.Object, _mapperMock.Object);

        var result = await service.CreateStaff(new StaffInput { Firstname = "Dave", Lastname = "Doe", FkRoleId = 1 });

        Assert.That(result, Is.GreaterThanOrEqualTo(0));
        dbSetMock.Verify(d => d.AddAsync(It.IsAny<Staff>(), It.IsAny<CancellationToken>()), Times.Once);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public async Task CreateStaff_SetsFieldsFromInput()
    {
        Staff? captured = null;
        var staff = new List<Staff>();
        var dbSetMock = MockDbSetHelper.Create(staff);
        dbSetMock
            .Setup(d => d.AddAsync(It.IsAny<Staff>(), It.IsAny<CancellationToken>()))
            .Callback<Staff, CancellationToken>((s, _) => captured = s)
            .Returns(ValueTask.FromResult((Microsoft.EntityFrameworkCore.ChangeTracking.EntityEntry<Staff>)null!));
        _contextMock.Setup(c => c.Staff).Returns(dbSetMock.Object);
        var service = new StaffService(_contextMock.Object, _mapperMock.Object);

        await service.CreateStaff(new StaffInput { Firstname = "Eve", Lastname = "Evans", FkRoleId = 3 });

        Assert.That(captured, Is.Not.Null);
        Assert.That(captured!.Firstname, Is.EqualTo("Eve"));
        Assert.That(captured.Lastname, Is.EqualTo("Evans"));
        Assert.That(captured.FkRoleId, Is.EqualTo(3));
    }
}
