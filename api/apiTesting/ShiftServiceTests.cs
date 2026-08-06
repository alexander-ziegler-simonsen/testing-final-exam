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
public class ShiftServiceTests
{
    private HospitalContext _context = null!;
    private ShiftService _service = null!;

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
        _service = new ShiftService(_context, mapper);
    }

    [TearDown]
    public void TearDown() => _context.Dispose();

    // reference timestamps
    private static readonly DateTime D1 = new(2025, 6, 1,  8, 0, 0);
    private static readonly DateTime D2 = new(2025, 6, 1, 16, 0, 0);
    private static readonly DateTime D3 = new(2025, 6, 2,  8, 0, 0);
    private static readonly DateTime D4 = new(2025, 6, 2, 16, 0, 0);
    private static readonly DateTime D5 = new(2025, 6, 3,  8, 0, 0);
    private static readonly DateTime D6 = new(2025, 6, 3, 16, 0, 0);

    private async Task SeedThreeShifts()
    {
        _context.Shifts.AddRange(
            new Shift { Id = 1, StartTime = D1, EndTime = D2 }, // day 1
            new Shift { Id = 2, StartTime = D3, EndTime = D4 }, // day 2
            new Shift { Id = 3, StartTime = D5, EndTime = D6 }  // day 3
        );
        await _context.SaveChangesAsync();
    }

    // filtering

    [Test]
    public async Task GetAll_WithNoFilters_ReturnsAllShifts()
    {
        await SeedThreeShifts();

        var result = (await _service.GetAll()).ToList();

        Assert.That(result, Has.Count.EqualTo(3));
    }

    [Test]
    public async Task GetAll_WithFromFilter_ExcludesShiftsEndingBeforeFrom()
    {
        await SeedThreeShifts();
        // from = start of day 2 → shift 1 (EndTime = D2) is excluded because EndTime < from
        var result = (await _service.GetAll(from: D3)).ToList();

        Assert.That(result, Has.Count.EqualTo(2));
        Assert.That(result.Select(s => s.Id), Is.EquivalentTo(new[] { 2, 3 }));
    }

    [Test]
    public async Task GetAll_WithFromFilter_IncludesShiftWhoseEndTimeMeetsFrom()
    {
        await SeedThreeShifts();
        // shift 1 ends at D2; from = D2 → EndTime >= from, so included
        var result = (await _service.GetAll(from: D2)).ToList();

        Assert.That(result.Select(s => s.Id), Does.Contain(1));
    }

    [Test]
    public async Task GetAll_WithToFilter_ExcludesShiftsStartingAfterTo()
    {
        await SeedThreeShifts();
        // to = end of day 1 → shift 3 (StartTime = D5) is excluded
        var result = (await _service.GetAll(to: D2)).ToList();

        Assert.That(result, Has.Count.EqualTo(1));
        Assert.That(result[0].Id, Is.EqualTo(1));
    }

    [Test]
    public async Task GetAll_WithToFilter_IncludesShiftWhoseStartTimeMeetsTo()
    {
        await SeedThreeShifts();
        // shift 2 starts at D3; to = D3 → StartTime <= to, so included
        var result = (await _service.GetAll(to: D3)).ToList();

        Assert.That(result.Select(s => s.Id), Does.Contain(2));
    }

    [Test]
    public async Task GetAll_WithBothFilters_ReturnsOverlappingShifts()
    {
        await SeedThreeShifts();
        // from=D2, to=D3:
        //   shift 1 (End=D2>=D2 ✓, Start=D1<=D3 ✓) included
        //   shift 2 (End=D4>=D2 ✓, Start=D3<=D3 ✓) included
        //   shift 3 (End=D6>=D2 ✓, Start=D5<=D3 ✗) excluded
        var result = (await _service.GetAll(from: D2, to: D3)).ToList();

        Assert.That(result.Select(s => s.Id), Is.EquivalentTo(new[] { 1, 2 }));
    }

    [Test]
    public async Task GetAll_WithFiltersMatchingNoShift_ReturnsEmpty()
    {
        await SeedThreeShifts();

        var pastDate = D1.AddYears(-1);
        var result = (await _service.GetAll(from: pastDate, to: pastDate)).ToList();

        Assert.That(result, Is.Empty);
    }

    // sorting

    [Test]
    public async Task GetAll_SortByStartTimeAsc_ReturnsSortedResults()
    {
        _context.Shifts.AddRange(
            new Shift { Id = 3, StartTime = D5, EndTime = D6 },
            new Shift { Id = 1, StartTime = D1, EndTime = D2 },
            new Shift { Id = 2, StartTime = D3, EndTime = D4 }
        );
        await _context.SaveChangesAsync();

        var result = (await _service.GetAll(sortBy: "starttime", sortDir: "asc"))
            .Select(s => s.Id).ToList();

        Assert.That(result, Is.EqualTo(new[] { 1, 2, 3 }));
    }

    [Test]
    public async Task GetAll_SortByStartTimeDesc_ReturnsSortedResults()
    {
        await SeedThreeShifts();

        var result = (await _service.GetAll(sortBy: "starttime", sortDir: "desc"))
            .Select(s => s.Id).ToList();

        Assert.That(result, Is.EqualTo(new[] { 3, 2, 1 }));
    }

    [Test]
    public async Task GetAll_SortByEndTimeDesc_ReturnsSortedResults()
    {
        await SeedThreeShifts();

        var result = (await _service.GetAll(sortBy: "endtime", sortDir: "desc"))
            .Select(s => s.Id).ToList();

        Assert.That(result, Is.EqualTo(new[] { 3, 2, 1 }));
    }

    [Test]
    public async Task GetAll_WithUnknownSortBy_DefaultSortsByIdAsc()
    {
        _context.Shifts.AddRange(
            new Shift { Id = 3, StartTime = D5, EndTime = D6 },
            new Shift { Id = 1, StartTime = D1, EndTime = D2 },
            new Shift { Id = 2, StartTime = D3, EndTime = D4 }
        );
        await _context.SaveChangesAsync();

        var result = (await _service.GetAll(sortBy: "unknown"))
            .Select(s => s.Id).ToList();

        Assert.That(result, Is.EqualTo(new[] { 1, 2, 3 }));
    }

    // GetOne

    [Test]
    public async Task GetOne_WhenShiftExists_ReturnsMappedOutput()
    {
        await SeedThreeShifts();

        var result = await _service.GetOne(2);

        Assert.That(result, Is.Not.Null);
        Assert.That(result.Id, Is.EqualTo(2));
    }

    [Test]
    public async Task GetOne_WhenShiftNotFound_ReturnsNull()
    {
        var result = await _service.GetOne(99);

        Assert.That(result, Is.Null);
    }

    // DeleteShift

    [Test]
    public async Task DeleteShift_WhenExists_ReturnsTrueAndRemovesFromDatabase()
    {
        await SeedThreeShifts();

        var result = await _service.DeleteShift(1);
        var fromDb = await _context.Shifts.FindAsync(1);

        Assert.That(result, Is.True);
        Assert.That(fromDb, Is.Null);
    }

    [Test]
    public async Task DeleteShift_WhenNotFound_ReturnsFalse()
    {
        var result = await _service.DeleteShift(99);

        Assert.That(result, Is.False);
    }

    // EditShift

    [Test]
    public async Task EditShift_WhenExists_UpdatesTimesInDatabase()
    {
        _context.Shifts.Add(new Shift { Id = 1, StartTime = D1, EndTime = D2 });
        await _context.SaveChangesAsync();

        var result = await _service.EditShift(1, new ShiftInput { StartTime = D3, EndTime = D4 });
        var updated = await _context.Shifts.FindAsync(1);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.True);
            Assert.That(updated!.StartTime, Is.EqualTo(D3));
            Assert.That(updated.EndTime, Is.EqualTo(D4));
        });
    }

    [Test]
    public async Task EditShift_WhenNotFound_ReturnsFalse()
    {
        var result = await _service.EditShift(99, new ShiftInput());

        Assert.That(result, Is.False);
    }
}
