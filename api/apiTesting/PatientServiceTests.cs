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
public class PatientServiceTests
{
    private HospitalContext _context = null!;
    private PatientService _service = null!;

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
        _service = new PatientService(_context, mapper);
    }

    [TearDown]
    public void TearDown() => _context.Dispose();

    private async Task SeedSortFixture()
    {
        _context.Patients.AddRange(
            new Patient { Id = 2, Firstname = "Charlie", Lastname = "Brown",   Gender = "Male"   },
            new Patient { Id = 1, Firstname = "Alice",   Lastname = "Smith",   Gender = "Female" },
            new Patient { Id = 3, Firstname = "Bob",     Lastname = "Johnson", Gender = "Male"   }
        );
        await _context.SaveChangesAsync();
    }

    // GetAll – sort by firstname

    [TestCase("asc",  new[] { "Alice", "Bob", "Charlie" })]
    [TestCase("desc", new[] { "Charlie", "Bob", "Alice" })]
    public async Task GetAll_SortByFirstname_ReturnsCorrectOrder(string sortDir, string[] expected)
    {
        await SeedSortFixture();

        var result = (await _service.GetAll(sortBy: "firstname", sortDir: sortDir))
            .Select(p => p.Firstname).ToList();

        Assert.That(result, Is.EqualTo(expected));
    }

    // GetAll – sort by lastname

    [TestCase("asc",  new[] { "Brown", "Johnson", "Smith" })]
    [TestCase("desc", new[] { "Smith", "Johnson", "Brown" })]
    public async Task GetAll_SortByLastname_ReturnsCorrectOrder(string sortDir, string[] expected)
    {
        await SeedSortFixture();

        var result = (await _service.GetAll(sortBy: "lastname", sortDir: sortDir))
            .Select(p => p.Lastname).ToList();

        Assert.That(result, Is.EqualTo(expected));
    }

    // GetAll – filter by gender
    // The service uses substring Contains matching.
    // "female".Contains("male") == true, so "Male" also matches Female patients.

    [TestCase("Female", 1)]
    [TestCase("Male",   3)]  // all 3 because "female".Contains("male") == true
    [TestCase("Other",  0)]
    public async Task GetAll_FilterByGender_ReturnsExpectedCount(string gender, int expectedCount)
    {
        await SeedSortFixture();

        var result = (await _service.GetAll(new PatientInput { Gender = gender })).ToList();

        Assert.That(result, Has.Count.EqualTo(expectedCount));
    }

    // GetOne

    private static IEnumerable<TestCaseData> GetOneTestCases()
    {
        yield return new TestCaseData(1, "Alice")
            .SetName("GetOne_ExistingId_ReturnsCorrectPatient");
        yield return new TestCaseData(2, "Charlie")
            .SetName("GetOne_SecondPatient_ReturnsCorrectPatient");
        yield return new TestCaseData(99, null)
            .SetName("GetOne_NonExistentId_ReturnsNull");
    }

    [TestCaseSource(nameof(GetOneTestCases))]
    public async Task GetOne_ReturnsExpectedResult(int id, string? expectedFirstname)
    {
        await SeedSortFixture();

        var result = await _service.GetOne(id);

        if (expectedFirstname is null)
            Assert.That(result, Is.Null);
        else
            Assert.That(result!.Firstname, Is.EqualTo(expectedFirstname));
    }

    // CreatePatient

    [Test]
    public async Task CreatePatient_PersistsToDatabase()
    {
        var input = new PatientInput { Firstname = "Dana", Lastname = "White", Gender = "Female", CprNumber = "010101-0001" };

        var id = await _service.CreatePatient(input);
        var fromDb = await _context.Patients.FindAsync(id);

        Assert.Multiple(() =>
        {
            Assert.That(id, Is.GreaterThan(0));
            Assert.That(fromDb!.Firstname, Is.EqualTo("Dana"));
            Assert.That(fromDb.Gender, Is.EqualTo("Female"));
        });
    }

    // EditPatient

    [Test]
    public async Task EditPatient_WithValidId_UpdatesInDatabase()
    {
        _context.Patients.Add(new Patient { Id = 1, Firstname = "Before", Lastname = "Test", Gender = "Male" });
        await _context.SaveChangesAsync();

        var result = await _service.EditPatient(1, new PatientInput { Firstname = "After", Lastname = "Test", Gender = "Male" });
        var updated = await _context.Patients.FindAsync(1);

        Assert.That(result, Is.True);
        Assert.That(updated!.Firstname, Is.EqualTo("After"));
    }

    [Test]
    public async Task EditPatient_WithInvalidId_ReturnsFalse()
    {
        var result = await _service.EditPatient(999, new PatientInput { Firstname = "Ghost" });

        Assert.That(result, Is.False);
    }

    // DeletePatient

    [Test]
    public async Task DeletePatient_WithValidId_RemovesFromDatabase()
    {
        _context.Patients.Add(new Patient { Id = 1, Firstname = "ToDelete", Lastname = "X", Gender = "Male" });
        await _context.SaveChangesAsync();

        var result = await _service.DeletePatient(1);
        var fromDb = await _context.Patients.FindAsync(1);

        Assert.That(result, Is.True);
        Assert.That(fromDb, Is.Null);
    }

    [Test]
    public async Task DeletePatient_WithInvalidId_ReturnsFalse()
    {
        var result = await _service.DeletePatient(999);

        Assert.That(result, Is.False);
    }
}
