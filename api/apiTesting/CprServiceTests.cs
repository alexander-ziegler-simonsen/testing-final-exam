using hospitalApi.Data;
using hospitalApi.Models;
using hospitalApi.Services;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;

namespace hospitalApiTesting;

public class CprServiceTests
{
    // CprService picks the century digit and serial digits at random, so the
    // generation tests repeat enough times to hit most of the possible values.
    private const int Repetitions = 50;

    private HospitalContext _context;
    private CprService _service;

    [SetUp]
    public void Setup()
    {
        _context = new HospitalContext(new DbContextOptionsBuilder<HospitalContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options);
        _service = new CprService(_context);
    }

    [TearDown]
    public void TearDown()
    {
        _context.Dispose();
    }

    [Test]
    public async Task GenerateCprNumber_ForMaleAndFemale_SetsCorrectGenderDigitParity()
    {
        for (int i = 0; i < Repetitions; i++)
        {
            var male = await _service.GenerateCprNumber(new DateOnly(1990, 1, 1), "male");
            var female = await _service.GenerateCprNumber(new DateOnly(1990, 1, 1), "female");

            Assert.That(int.Parse(male[^1..]) % 2, Is.EqualTo(1), male);
            Assert.That(int.Parse(female[^1..]) % 2, Is.EqualTo(0), female);
        }
    }

    // --- Century decision table (BVA): both edges of every year range the
    // service picks a century digit for. Decode() is an independent oracle, so a
    // digit from the wrong range decodes to the wrong century and fails. ---
    [TestCase(1858, 1, 1)]   // lower boundary of what CPR can encode
    [TestCase(1899, 12, 31)]
    [TestCase(1900, 1, 1)]
    [TestCase(1936, 12, 31)]
    [TestCase(1937, 1, 1)]
    [TestCase(1999, 12, 31)]
    [TestCase(2000, 1, 1)]
    [TestCase(2036, 12, 31)]
    [TestCase(2037, 1, 1)]
    [TestCase(2057, 12, 31)] // upper boundary of what CPR can encode
    public async Task GenerateCprNumber_ForEncodableDates_DecodesBackToBirthDate(int year, int month, int day)
    {
        var birthDate = new DateOnly(year, month, day);

        for (int i = 0; i < Repetitions; i++)
        {
            var cpr = await _service.GenerateCprNumber(birthDate, "male");

            Assert.That(cpr, Has.Length.EqualTo(10));
            Assert.That(cpr.All(char.IsAsciiDigit), Is.True, cpr);
            Assert.That(Decode(cpr), Is.EqualTo(birthDate), cpr);
        }
    }

    [Test]
    public async Task GenerateCprNumber_WhenEveryCprForTheDateIsTaken_ThrowsInvalidOperationException()
    {
        // Every female CPR for 01-01-1858 already belongs to a patient, whatever
        // century/serial digits the service picks, so every attempt collides.
        var birthDate = new DateOnly(1858, 1, 1);
        for (int serial = 0; serial < 1000; serial++)
        {
            foreach (char genderDigit in "02468")
            {
                _context.Patients.Add(new Patient
                {
                    Firstname = "Taken",
                    Lastname = "Patient",
                    Gender = "female",
                    CprNumber = $"010158{serial:D3}{genderDigit}",
                    DateOfBirth = birthDate
                });
            }
        }
        await _context.SaveChangesAsync();

        Assert.ThrowsAsync<InvalidOperationException>(() =>
            _service.GenerateCprNumber(birthDate, "female"));
    }

    // Century decision table for digit 7 (the first digit of SSSS), combined with YY:
    //   digit 0-3    -> always 19xx
    //   digit 4 or 9 -> YY 00-36 => 20xx, YY 37-99 => 19xx
    //   digit 5-8    -> YY 00-57 => 20xx, YY 58-99 => 18xx
    private static DateOnly Decode(string cpr)
    {
        int day = int.Parse(cpr[0..2]);
        int month = int.Parse(cpr[2..4]);
        int yy = int.Parse(cpr[4..6]);
        int centuryDigit = cpr[6] - '0';

        int century = centuryDigit switch
        {
            >= 0 and <= 3 => 1900,
            4 or 9 => yy <= 36 ? 2000 : 1900,
            _ => yy <= 57 ? 2000 : 1800
        };

        return new DateOnly(century + yy, month, day);
    }
}
