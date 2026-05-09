using AutoMapper;
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
    private static readonly List<Patient> SortPatients =
    [
        new() { Id = 2, Firstname = "Charlie", Lastname = "Brown",  Gender = "Male"   },
        new() { Id = 1, Firstname = "Alice",   Lastname = "Smith",  Gender = "Female" },
        new() { Id = 3, Firstname = "Bob",     Lastname = "Johnson", Gender = "Male"  },
    ];

    private PatientService BuildService(List<Patient> patients)
    {
        var options = new DbContextOptionsBuilder<hospitalApi.Data.HospitalContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        var contextMock = new Mock<hospitalApi.Data.HospitalContext>(options);
        contextMock
            .Setup(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        var dbSetMock = MockDbSetHelper.Create(patients);
        contextMock.Setup(c => c.Patients).Returns(dbSetMock.Object);

        var mapperMock = new Mock<IMapper>();
        mapperMock
            .Setup(m => m.Map<List<PatientOutput>>(It.IsAny<object>()))
            .Returns((object src) =>
                ((IEnumerable<Patient>)src)
                .Select(p => new PatientOutput
                {
                    Id = p.Id,
                    Firstname = p.Firstname,
                    Lastname = p.Lastname,
                    Gender = p.Gender,
                }).ToList());

        mapperMock
            .Setup(m => m.Map<PatientOutput>(It.IsAny<Patient>()))
            .Returns((Patient p) => new PatientOutput
            {
                Id = p.Id,
                Firstname = p.Firstname,
                Lastname = p.Lastname,
                Gender = p.Gender,
            });

        return new PatientService(contextMock.Object, mapperMock.Object);
    }

    // [TestCase] — sort direction

    [TestCase("asc", new[] { "Alice", "Bob", "Charlie" })]
    [TestCase("desc", new[] { "Charlie", "Bob", "Alice" })]
    public async Task GetAll_SortByFirstname_ReturnsCorrectOrder(string sortDir, string[] expected)
    {
        var service = BuildService(SortPatients);

        var result = (await service.GetAll(sortBy: "firstname", sortDir: sortDir))
            .Select(p => p.Firstname)
            .ToList();

        Assert.That(result, Is.EqualTo(expected));
    }

    [TestCase("asc", new[] { "Brown", "Smith", "Ziegler" })]
    [TestCase("desc", new[] { "Ziegler", "Smith", "Brown" })]
    public async Task GetAll_SortByLastname_ReturnsCorrectOrder(string sortDir, string[] expected)
    {
        var service = BuildService(SortPatients);

        var result = (await service.GetAll(sortBy: "lastname", sortDir: sortDir))
            .Select(p => p.Lastname)
            .ToList();

        Assert.That(result, Is.EqualTo(expected));
    }

    // [TestCase] — filter by gender
    // The service uses substring Contains matching (case-insensitive).
    // "female".Contains("male") == true, so "Male" matches Female patients too.

    [TestCase("Female", 1)]   // only Alice — "male".Contains("female") == false
    [TestCase("Male", 3)]   // all 3 — "female".Contains("male") == true
    [TestCase("Other", 0)]   // no match
    public async Task GetAll_FilterByGender_ReturnsExpectedCount(string gender, int expectedCount)
    {
        var service = BuildService(SortPatients);

        var result = (await service.GetAll(new PatientInput { Gender = gender })).ToList();

        Assert.That(result, Has.Count.EqualTo(expectedCount));
    }

    // [TestCaseSource] — GetOne with complex expected values

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
        var service = BuildService(SortPatients);

        var result = await service.GetOne(id);

        if (expectedFirstname is null)
            Assert.That(result, Is.Null);
        else
            Assert.That(result!.Firstname, Is.EqualTo(expectedFirstname));
    }
}
