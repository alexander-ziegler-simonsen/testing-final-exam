using AutoMapper;
using hospitalApi.Data;
using hospitalApi.DTOs.Inputs;
using hospitalApi.Mapping;
using hospitalApi.Models;
using hospitalApi.Services;
using Microsoft.EntityFrameworkCore;
using Testcontainers.PostgreSql;

namespace hospitalApiTesting;

[TestFixture]
public class DatabaseIntegrationTests
{
    private PostgreSqlContainer _postgres = null!;
    private HospitalContext _context = null!;
    private PatientService _patientService = null!;
    private IMapper _mapper = null!;

    [OneTimeSetUp]
    public async Task OneTimeSetUp()
    {
        _postgres = new PostgreSqlBuilder()
            .WithImage("postgres:15")
            .Build();

        await _postgres.StartAsync();

        var initSql = await File.ReadAllTextAsync(
            Path.Combine(TestContext.CurrentContext.TestDirectory,
                "..", "..", "..", "..", "..", "initScripts", "postgres", "init.sql"));

        await _postgres.ExecScriptAsync(initSql);
    }

    [OneTimeTearDown]
    public async Task OneTimeTearDown()
    {
        await _context.DisposeAsync();
        await _postgres.DisposeAsync();
    }

    [SetUp]
    public void SetUp()
    {
        var options = new DbContextOptionsBuilder<HospitalContext>()
            .UseNpgsql(_postgres.GetConnectionString())
            .Options;

        _context = new HospitalContext(options);

        var mapperConfig = new AutoMapper.MapperConfiguration(
            cfg => cfg.AddProfile(new MappingProfile()),
            Microsoft.Extensions.Logging.Abstractions.NullLoggerFactory.Instance);
        _mapper = mapperConfig.CreateMapper();

        _patientService = new PatientService(_context, _mapper);
    }

    [TearDown]
    public void TearDown()
    {
        _context.Dispose();
    }

    // GetAll

    [Test]
    public async Task GetAll_WithNoFilter_ReturnsAllSeededPatients()
    {
        var result = (await _patientService.GetAll()).ToList();

        Assert.That(result, Has.Count.EqualTo(25));
    }

    [Test]
    public async Task GetAll_FilterByFirstname_ReturnsMatchingPatients()
    {
        var result = (await _patientService.GetAll(new PatientInput { Firstname = "michael" })).ToList();

        Assert.That(result, Has.Count.EqualTo(2));
        Assert.That(result.All(p => p.Firstname!.ToLower().Contains("michael")), Is.True);
    }

    [Test]
    public async Task GetAll_FilterByGender_ReturnsMalePatients()
    {
        var result = (await _patientService.GetAll(new PatientInput { Gender = "male" })).ToList();

        Assert.That(result, Is.Not.Empty);
        Assert.That(result.All(p => p.Gender!.ToLower().Contains("male")), Is.True);
    }

    [Test]
    public async Task GetAll_SortByFirstnameAsc_FirstPatientComesBeforeLast()
    {
        var result = (await _patientService.GetAll(sortBy: "firstname", sortDir: "asc"))
            .Select(p => p.Firstname)
            .ToList();

        var sorted = result.OrderBy(n => n).ToList();
        Assert.That(result, Is.EqualTo(sorted));
    }

    [Test]
    public async Task GetAll_SortByLastnameDesc_FirstPatientComesAfterLast()
    {
        var result = (await _patientService.GetAll(sortBy: "lastname", sortDir: "desc"))
            .Select(p => p.Lastname)
            .ToList();

        var sorted = result.OrderByDescending(n => n).ToList();
        Assert.That(result, Is.EqualTo(sorted));
    }

    // GetOne

    [Test]
    public async Task GetOne_WithValidId_ReturnsCorrectPatient()
    {
        var result = await _patientService.GetOne(1);

        Assert.That(result, Is.Not.Null);
        Assert.That(result!.Firstname, Is.EqualTo("michael"));
        Assert.That(result.CprNumber, Is.EqualTo("150553-4561"));
    }

    [Test]
    public async Task GetOne_WithInvalidId_ReturnsNull()
    {
        var result = await _patientService.GetOne(9999);

        Assert.That(result, Is.Null);
    }

    // CreatePatient

    [Test]
    public async Task CreatePatient_WithValidInput_PersistsToDatabase()
    {
        var input = new PatientInput
        {
            Firstname = "TestCreate",
            Lastname = "User",
            Gender = "male",
            CprNumber = "999999-0001"
        };

        var created = await _patientService.CreatePatient(input);
        var fromDb = await _context.Patients.FirstOrDefaultAsync(p => p.CprNumber == "999999-0001");

        Assert.That(created, Is.GreaterThan(0));
        Assert.That(fromDb, Is.Not.Null);
        Assert.That(fromDb!.Firstname, Is.EqualTo("TestCreate"));

        // cleanup
        _context.Patients.Remove(fromDb);
        await _context.SaveChangesAsync();
    }

    //  EditPatient

    [Test]
    public async Task EditPatient_WithValidId_UpdatesInDatabase()
    {
        var newPatient = new Patient
        {
            Firstname = "EditBefore",
            Lastname = "Test",
            Gender = "female",
            CprNumber = "888888-0001"
        };
        await _context.Patients.AddAsync(newPatient);
        await _context.SaveChangesAsync();

        var input = new PatientInput
        {
            Firstname = "EditAfter",
            Lastname = "Test",
            Gender = "female",
            CprNumber = "888888-0001"
        };

        var result = await _patientService.EditPatient(newPatient.Id, input);
        var fromDb = await _context.Patients.FindAsync(newPatient.Id);

        Assert.That(result, Is.True);
        Assert.That(fromDb!.Firstname, Is.EqualTo("EditAfter"));

        // cleanup
        _context.Patients.Remove(fromDb);
        await _context.SaveChangesAsync();
    }

    [Test]
    public async Task EditPatient_WithInvalidId_ReturnsFalse()
    {
        var result = await _patientService.EditPatient(9999, new PatientInput { Firstname = "Ghost" });

        Assert.That(result, Is.False);
    }

    // DeletePatient

    [Test]
    public async Task DeletePatient_WithValidId_RemovesFromDatabase()
    {
        var patient = new Patient
        {
            Firstname = "ToDelete",
            Lastname = "Patient",
            Gender = "male",
            CprNumber = "777777-0001"
        };
        await _context.Patients.AddAsync(patient);
        await _context.SaveChangesAsync();

        var result = await _patientService.DeletePatient(patient.Id);
        var fromDb = await _context.Patients.FindAsync(patient.Id);

        Assert.That(result, Is.True);
        Assert.That(fromDb, Is.Null);
    }

    [Test]
    public async Task DeletePatient_WithInvalidId_ReturnsFalse()
    {
        var result = await _patientService.DeletePatient(9999);

        Assert.That(result, Is.False);
    }

    // Unique constraint

    [Test]
    public async Task CreatePatient_WithDuplicateCpr_ThrowsDbUpdateException()
    {
        var input = new PatientInput
        {
            Firstname = "Duplicate",
            Lastname = "Test",
            Gender = "male",
            CprNumber = "150553-4561" // already seeded
        };

        Assert.ThrowsAsync<Microsoft.EntityFrameworkCore.DbUpdateException>(
            () => _patientService.CreatePatient(input));
    }
}
