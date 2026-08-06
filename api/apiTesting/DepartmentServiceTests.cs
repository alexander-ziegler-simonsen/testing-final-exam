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
public class DepartmentServiceTests
{
    private HospitalContext _context = null!;
    private DepartmentService _service = null!;

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
        _service = new DepartmentService(_context, mapper);
    }

    [TearDown]
    public void TearDown() => _context.Dispose();

    private async Task SeedThreeDepartments()
    {
        _context.Departments.AddRange(
            new Department { Id = 1, Name = "Cardiology",  Type = "Medical"  },
            new Department { Id = 2, Name = "Orthopedics", Type = "Surgical" },
            new Department { Id = 3, Name = "Pediatrics",  Type = "Medical"  }
        );
        await _context.SaveChangesAsync();
    }

    // GetAll

    [Test]
    public async Task GetAll_ReturnsAllDepartments()
    {
        await SeedThreeDepartments();

        var result = (await _service.GetAll()).ToList();

        Assert.That(result, Has.Count.EqualTo(3));
    }

    [Test]
    public async Task GetAll_MapsNameCorrectly()
    {
        await SeedThreeDepartments();

        var names = (await _service.GetAll()).Select(d => d.Name).ToList();

        Assert.That(names, Does.Contain("Cardiology"));
        Assert.That(names, Does.Contain("Orthopedics"));
    }

    [Test]
    public async Task GetAll_EmptyStore_ReturnsEmptyList()
    {
        var result = (await _service.GetAll()).ToList();

        Assert.That(result, Is.Empty);
    }

    // GetOne

    [TestCase(1, "Cardiology")]
    [TestCase(2, "Orthopedics")]
    public async Task GetOne_ExistingId_ReturnsMappedDepartment(int id, string expectedName)
    {
        await SeedThreeDepartments();

        var result = await _service.GetOne(id);

        Assert.That(result, Is.Not.Null);
        Assert.That(result!.Name, Is.EqualTo(expectedName));
    }

    [Test]
    public async Task GetOne_NonExistentId_ReturnsNull()
    {
        await SeedThreeDepartments();

        var result = await _service.GetOne(999);

        Assert.That(result, Is.Null);
    }

    // CreateDepartment

    [Test]
    public async Task CreateDepartment_PersistsToDatabase()
    {
        var input = new DepartmentInput { Name = "Neurology", Type = "Medical" };

        var id = await _service.CreateDepartment(input);
        var fromDb = await _context.Departments.FindAsync(id);

        Assert.Multiple(() =>
        {
            Assert.That(id, Is.GreaterThan(0));
            Assert.That(fromDb!.Name, Is.EqualTo("Neurology"));
            Assert.That(fromDb.Type, Is.EqualTo("Medical"));
        });
    }

    // EditDepartment

    [Test]
    public async Task EditDepartment_WhenExists_UpdatesFieldsInDatabase()
    {
        _context.Departments.Add(new Department { Id = 1, Name = "OldName", Type = "OldType" });
        await _context.SaveChangesAsync();

        var result = await _service.EditDepartment(1, new DepartmentInput { Name = "NewName", Type = "NewType" });
        var updated = await _context.Departments.FindAsync(1);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.True);
            Assert.That(updated!.Name, Is.EqualTo("NewName"));
            Assert.That(updated.Type, Is.EqualTo("NewType"));
        });
    }

    [Test]
    public async Task EditDepartment_WhenNotFound_ReturnsFalse()
    {
        var result = await _service.EditDepartment(99, new DepartmentInput { Name = "X" });

        Assert.That(result, Is.False);
    }

    // DeleteDepartment

    [Test]
    public async Task DeleteDepartment_WhenExists_RemovesFromDatabase()
    {
        await SeedThreeDepartments();

        var result = await _service.DeleteDepartment(2);
        var fromDb = await _context.Departments.FindAsync(2);

        Assert.That(result, Is.True);
        Assert.That(fromDb, Is.Null);
    }

    [Test]
    public async Task DeleteDepartment_WhenNotFound_ReturnsFalse()
    {
        var result = await _service.DeleteDepartment(99);

        Assert.That(result, Is.False);
    }
}
