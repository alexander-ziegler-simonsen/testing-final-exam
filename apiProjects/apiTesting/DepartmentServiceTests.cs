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
public class DepartmentServiceTests
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

    private DepartmentService BuildService(List<Department> departments)
    {
        var dbSetMock = MockDbSetHelper.Create(departments);
        _contextMock.Setup(c => c.Departments).Returns(dbSetMock.Object);

        _mapperMock
            .Setup(m => m.Map<IEnumerable<DepartmentOutput>>(It.IsAny<object>()))
            .Returns((object src) =>
                ((IEnumerable<Department>)src).Select(d => new DepartmentOutput
                {
                    Id = d.Id,
                    Name = d.Name,
                    Type = d.Type,
                }));

        _mapperMock
            .Setup(m => m.Map<DepartmentOutput>(It.IsAny<Department>()))
            .Returns((Department d) => new DepartmentOutput
            {
                Id = d.Id,
                Name = d.Name,
                Type = d.Type,
            });

        _mapperMock
            .Setup(m => m.Map<Department>(It.IsAny<DepartmentInput>()))
            .Returns((DepartmentInput input) => new Department
            {
                Name = input.Name,
                Type = input.Type,
            });

        return new DepartmentService(_contextMock.Object, _mapperMock.Object);
    }

    private List<Department> ThreeDepartments() =>
    [
        new() { Id = 1, Name = "Cardiology",  Type = "Medical"  },
        new() { Id = 2, Name = "Orthopedics", Type = "Surgical" },
        new() { Id = 3, Name = "Pediatrics",  Type = "Medical"  },
    ];

    // GetAll

    [Test]
    public async Task GetAll_ReturnsAllDepartments()
    {
        var service = BuildService(ThreeDepartments());

        var result = (await service.GetAll()).ToList();

        Assert.That(result, Has.Count.EqualTo(3));
    }

    [Test]
    public async Task GetAll_MapsNameCorrectly()
    {
        var service = BuildService(ThreeDepartments());

        var names = (await service.GetAll()).Select(d => d.Name).ToList();

        Assert.That(names, Does.Contain("Cardiology"));
        Assert.That(names, Does.Contain("Orthopedics"));
    }

    [Test]
    public async Task GetAll_EmptyStore_ReturnsEmptyList()
    {
        var service = BuildService([]);

        var result = (await service.GetAll()).ToList();

        Assert.That(result, Is.Empty);
    }

    // GetOne

    [TestCase(1, "Cardiology")]
    [TestCase(2, "Orthopedics")]
    public async Task GetOne_ExistingId_ReturnsMappedDepartment(int id, string expectedName)
    {
        var service = BuildService(ThreeDepartments());

        var result = await service.GetOne(id);

        Assert.That(result, Is.Not.Null);
        Assert.That(result!.Name, Is.EqualTo(expectedName));
    }

    [Test]
    public async Task GetOne_NonExistentId_ReturnsNull()
    {
        var service = BuildService(ThreeDepartments());

        var result = await service.GetOne(999);

        Assert.That(result, Is.Null);
    }

    // CreateDepartment

    [Test]
    public async Task CreateDepartment_AddsEntityAndSavesChanges()
    {
        var departments = new List<Department>();
        var dbSetMock = MockDbSetHelper.Create(departments);
        _contextMock.Setup(c => c.Departments).Returns(dbSetMock.Object);
        _mapperMock
            .Setup(m => m.Map<Department>(It.IsAny<DepartmentInput>()))
            .Returns((DepartmentInput input) => new Department { Name = input.Name, Type = input.Type });
        var service = new DepartmentService(_contextMock.Object, _mapperMock.Object);

        await service.CreateDepartment(new DepartmentInput { Name = "Neurology", Type = "Medical" });

        dbSetMock.Verify(s => s.AddAsync(It.Is<Department>(d => d.Name == "Neurology"), It.IsAny<CancellationToken>()), Times.Once);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    // EditDepartment

    [Test]
    public async Task EditDepartment_WhenExists_UpdatesFieldsAndReturnsTrue()
    {
        var dept = new Department { Id = 1, Name = "OldName", Type = "OldType" };
        var service = BuildService([dept]);
        var input = new DepartmentInput { Name = "NewName", Type = "NewType" };

        var result = await service.EditDepartment(1, input);

        Assert.That(result, Is.True);
        Assert.That(dept.Name, Is.EqualTo("NewName"));
        Assert.That(dept.Type, Is.EqualTo("NewType"));
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public async Task EditDepartment_WhenNotFound_ReturnsFalseWithoutSaving()
    {
        var service = BuildService([]);

        var result = await service.EditDepartment(99, new DepartmentInput { Name = "X" });

        Assert.That(result, Is.False);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    // DeleteDepartment

    [Test]
    public async Task DeleteDepartment_WhenExists_ReturnsTrueAndSavesChanges()
    {
        var departments = ThreeDepartments();
        var dbSetMock = MockDbSetHelper.Create(departments);
        _contextMock.Setup(c => c.Departments).Returns(dbSetMock.Object);
        _mapperMock.Setup(m => m.Map<DepartmentOutput>(It.IsAny<Department>())).Returns(new DepartmentOutput());
        var service = new DepartmentService(_contextMock.Object, _mapperMock.Object);

        var result = await service.DeleteDepartment(2);

        Assert.That(result, Is.True);
        dbSetMock.Verify(s => s.Remove(It.Is<Department>(d => d.Id == 2)), Times.Once);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public async Task DeleteDepartment_WhenNotFound_ReturnsFalseWithoutSaving()
    {
        var service = BuildService([]);

        var result = await service.DeleteDepartment(99);

        Assert.That(result, Is.False);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }
}
