using hospitalApi.Data;
using hospitalApi.Services;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;

namespace hospitalApiTesting.Services;

public class CprServiceTest
{
    private HospitalContext _context = null!;
    private CprService _service = null!;

    [SetUp]
    public void Setup()
    {
        var options = new DbContextOptionsBuilder<HospitalContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _context = new HospitalContext(options);
        _service = new CprService(_context);
    }

    [TearDown]
    public void TearDown()
    {
        _context.Dispose();
    }

    // 1858-1899
    [TestCase("01-01-1858", "female", "010158", new[] { 5, 6, 7, 8 })]
    [TestCase("15-03-1880", "male",   "150380", new[] { 5, 6, 7, 8 })]
    [TestCase("20-08-1890", "female", "200890", new[] { 5, 6, 7, 8 })]
    [TestCase("31-12-1899", "male",   "311299", new[] { 5, 6, 7, 8 })]
    // 1900-1936
    [TestCase("01-01-1900", "male",   "010100", new[] { 0, 1, 2, 3 })]
    [TestCase("10-05-1915", "male",   "100515", new[] { 0, 1, 2, 3 })]
    [TestCase("01-07-1925", "female", "010725", new[] { 0, 1, 2, 3 })]
    [TestCase("31-12-1936", "female", "311236", new[] { 0, 1, 2, 3 })]
    // 1937-1999
    [TestCase("01-01-1937", "female", "010137", new[] { 0, 1, 2, 3, 4, 9 })]
    [TestCase("24-12-1968", "male",   "241268", new[] { 0, 1, 2, 3, 4, 9 })]
    [TestCase("30-06-1985", "female", "300685", new[] { 0, 1, 2, 3, 4, 9 })]
    [TestCase("31-12-1999", "male",   "311299", new[] { 0, 1, 2, 3, 4, 9 })]
    // 2000-2036
    [TestCase("01-01-2000", "male",   "010100", new[] { 4, 5, 6, 7, 8, 9 })]
    [TestCase("28-02-2010", "female", "280210", new[] { 4, 5, 6, 7, 8, 9 })]
    [TestCase("29-02-2024", "male",   "290224", new[] { 4, 5, 6, 7, 8, 9 })]
    [TestCase("31-12-2036", "female", "311236", new[] { 4, 5, 6, 7, 8, 9 })]
    // 2037-2057
    [TestCase("01-01-2037", "female", "010137", new[] { 5, 6, 7, 8 })]
    [TestCase("09-09-2045", "male",   "090945", new[] { 5, 6, 7, 8 })]
    [TestCase("18-04-2050", "female", "180450", new[] { 5, 6, 7, 8 })]
    [TestCase("31-12-2057", "male",   "311257", new[] { 5, 6, 7, 8 })]
    public async Task GenerateCprNumbers(
        string birthDate, string gender, string expectedDatePart, int[] allowedCenturyDigits)
    {
        var date = DateOnly.ParseExact(birthDate, "dd-MM-yyyy");

        string cpr = await _service.GenerateCprNumber(date, gender);

        Assert.That(cpr, Has.Length.EqualTo(10));

        string datePart = cpr[..6]; // not including 6 (0 to 5)
        int centuryDigit = cpr[6] - '0'; // (6)
        int lastFour = int.Parse(cpr[6..]); // (6,7,8,9)
        bool isEven = lastFour % 2 == 0;

        Assert.Multiple(() =>
        {
            Assert.That(datePart, Is.EqualTo(expectedDatePart));
            Assert.That(allowedCenturyDigits, Does.Contain(centuryDigit));
            Assert.That(isEven, Is.EqualTo(gender == "female"));
        });
    }
}
