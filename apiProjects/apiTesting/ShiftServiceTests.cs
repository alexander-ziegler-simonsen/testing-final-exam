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
public class ShiftServiceTests
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

    private ShiftService BuildService(List<Shift> shifts)
    {
        var dbSetMock = MockDbSetHelper.Create(shifts);
        _contextMock.Setup(c => c.Shifts).Returns(dbSetMock.Object);

        _mapperMock
            .Setup(m => m.Map<IEnumerable<ShiftOutput>>(It.IsAny<object>()))
            .Returns((object src) =>
                ((IEnumerable<Shift>)src).Select(s => new ShiftOutput
                {
                    Id = s.Id,
                    StartTime = s.StartTime,
                    EndTime = s.EndTime,
                }));

        _mapperMock
            .Setup(m => m.Map<ShiftOutput>(It.IsAny<Shift>()))
            .Returns((Shift s) => new ShiftOutput
            {
                Id = s.Id,
                StartTime = s.StartTime,
                EndTime = s.EndTime,
            });

        return new ShiftService(_contextMock.Object, _mapperMock.Object);
    }

    // reference timestamps
    private static readonly DateTime D1 = new DateTime(2025, 6, 1, 8, 0, 0);
    private static readonly DateTime D2 = new DateTime(2025, 6, 1, 16, 0, 0);
    private static readonly DateTime D3 = new DateTime(2025, 6, 2, 8, 0, 0);
    private static readonly DateTime D4 = new DateTime(2025, 6, 2, 16, 0, 0);
    private static readonly DateTime D5 = new DateTime(2025, 6, 3, 8, 0, 0);
    private static readonly DateTime D6 = new DateTime(2025, 6, 3, 16, 0, 0);

    private List<Shift> ThreeShifts() => new()
    {
        new Shift { Id = 1, StartTime = D1, EndTime = D2 }, // day 1
        new Shift { Id = 2, StartTime = D3, EndTime = D4 }, // day 2
        new Shift { Id = 3, StartTime = D5, EndTime = D6 }, // day 3
    };

    // filtering

    [Test]
    public async Task GetAll_WithNoFilters_ReturnsAllShifts()
    {
        var service = BuildService(ThreeShifts());

        var result = (await service.GetAll()).ToList();

        Assert.That(result, Has.Count.EqualTo(3));
    }

    [Test]
    public async Task GetAll_WithFromFilter_ExcludesShiftsEndingBeforeFrom()
    {
        // from = start of day 2 → shift 1 (EndTime = D2) is excluded
        // because EndTime < from
        var service = BuildService(ThreeShifts());

        var result = (await service.GetAll(from: D3)).ToList();

        Assert.That(result, Has.Count.EqualTo(2));
        Assert.That(result.Select(s => s.Id), Is.EquivalentTo(new[] { 2, 3 }));
    }

    [Test]
    public async Task GetAll_WithFromFilter_IncludesShiftWhoseEndTimeMeetsFrom()
    {
        // shift 1 ends at D2; from = D2 → EndTime >= from, so included
        var service = BuildService(ThreeShifts());

        var result = (await service.GetAll(from: D2)).ToList();

        Assert.That(result.Select(s => s.Id), Does.Contain(1));
    }

    [Test]
    public async Task GetAll_WithToFilter_ExcludesShiftsStartingAfterTo()
    {
        // to = end of day 1 → shift 3 (StartTime = D5) is excluded
        var service = BuildService(ThreeShifts());

        var result = (await service.GetAll(to: D2)).ToList();

        Assert.That(result, Has.Count.EqualTo(1));
        Assert.That(result[0].Id, Is.EqualTo(1));
    }

    [Test]
    public async Task GetAll_WithToFilter_IncludesShiftWhoseStartTimeMeetsTo()
    {
        // shift 2 starts at D3; to = D3 → StartTime <= to, so included
        var service = BuildService(ThreeShifts());

        var result = (await service.GetAll(to: D3)).ToList();

        Assert.That(result.Select(s => s.Id), Does.Contain(2));
    }

    [Test]
    public async Task GetAll_WithBothFilters_ReturnsOnlyOverlappingShifts()
    {
        // from = D2 (start of window), to = D3 (end of window) → only shift 2
        var service = BuildService(ThreeShifts());

        var result = (await service.GetAll(from: D2, to: D3)).ToList();

        Assert.That(result.Select(s => s.Id), Is.EquivalentTo(new[] { 1, 2 }));
    }

    [Test]
    public async Task GetAll_WithFiltersMatchingNoShift_ReturnsEmpty()
    {
        var service = BuildService(ThreeShifts());

        var pastDate = D1.AddYears(-1);
        var result = (await service.GetAll(from: pastDate, to: pastDate)).ToList();

        Assert.That(result, Is.Empty);
    }

    // sorting

    [Test]
    public async Task GetAll_SortByStartTimeAsc_ReturnsSortedResults()
    {
        var unordered = new List<Shift>
        {
            new Shift { Id = 3, StartTime = D5, EndTime = D6 },
            new Shift { Id = 1, StartTime = D1, EndTime = D2 },
            new Shift { Id = 2, StartTime = D3, EndTime = D4 },
        };
        var service = BuildService(unordered);

        var result = (await service.GetAll(sortBy: "starttime", sortDir: "asc"))
            .Select(s => s.Id).ToList();

        Assert.That(result, Is.EqualTo(new[] { 1, 2, 3 }));
    }

    [Test]
    public async Task GetAll_SortByStartTimeDesc_ReturnsSortedResults()
    {
        var service = BuildService(ThreeShifts());

        var result = (await service.GetAll(sortBy: "starttime", sortDir: "desc"))
            .Select(s => s.Id).ToList();

        Assert.That(result, Is.EqualTo(new[] { 3, 2, 1 }));
    }

    [Test]
    public async Task GetAll_SortByEndTimeDesc_ReturnsSortedResults()
    {
        var service = BuildService(ThreeShifts());

        var result = (await service.GetAll(sortBy: "endtime", sortDir: "desc"))
            .Select(s => s.Id).ToList();

        Assert.That(result, Is.EqualTo(new[] { 3, 2, 1 }));
    }

    [Test]
    public async Task GetAll_WithUnknownSortBy_DefaultSortsByIdAsc()
    {
        var unordered = new List<Shift>
        {
            new Shift { Id = 3, StartTime = D5, EndTime = D6 },
            new Shift { Id = 1, StartTime = D1, EndTime = D2 },
            new Shift { Id = 2, StartTime = D3, EndTime = D4 },
        };
        var service = BuildService(unordered);

        var result = (await service.GetAll(sortBy: "unknown"))
            .Select(s => s.Id).ToList();

        Assert.That(result, Is.EqualTo(new[] { 1, 2, 3 }));
    }

    // GetOne

    [Test]
    public async Task GetOne_WhenShiftExists_ReturnsMappedOutput()
    {
        var service = BuildService(ThreeShifts());

        var result = await service.GetOne(2);

        Assert.That(result, Is.Not.Null);
        Assert.That(result.Id, Is.EqualTo(2));
    }

    [Test]
    public async Task GetOne_WhenShiftNotFound_ReturnsNull()
    {
        var service = BuildService(new List<Shift>());

        var result = await service.GetOne(99);

        Assert.That(result, Is.Null);
    }

    // DeleteShift

    [Test]
    public async Task DeleteShift_WhenExists_ReturnsTrueAndSavesChanges()
    {
        var shifts = ThreeShifts();
        var dbSetMock = MockDbSetHelper.Create(shifts);
        _contextMock.Setup(c => c.Shifts).Returns(dbSetMock.Object);
        _mapperMock.Setup(m => m.Map<ShiftOutput>(It.IsAny<Shift>())).Returns(new ShiftOutput());
        var service = new ShiftService(_contextMock.Object, _mapperMock.Object);

        var result = await service.DeleteShift(1);

        Assert.That(result, Is.True);
        dbSetMock.Verify(s => s.Remove(It.Is<Shift>(sh => sh.Id == 1)), Times.Once);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public async Task DeleteShift_WhenNotFound_ReturnsFalseWithoutSaving()
    {
        var service = BuildService(new List<Shift>());

        var result = await service.DeleteShift(99);

        Assert.That(result, Is.False);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    // EditShift

    [Test]
    public async Task EditShift_WhenExists_UpdatesTimesAndReturnsTrue()
    {
        var shift = new Shift { Id = 1, StartTime = D1, EndTime = D2 };
        var service = BuildService(new List<Shift> { shift });
        var newEnd = D2.AddHours(4);
        var input = new ShiftInput { StartTime = D3, EndTime = newEnd };

        var result = await service.EditShift(1, input);

        Assert.That(result, Is.True);
        Assert.That(shift.StartTime, Is.EqualTo(D3));
        Assert.That(shift.EndTime, Is.EqualTo(newEnd));
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public async Task EditShift_WhenNotFound_ReturnsFalseWithoutSaving()
    {
        var service = BuildService(new List<Shift>());

        var result = await service.EditShift(99, new ShiftInput());

        Assert.That(result, Is.False);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }
}
