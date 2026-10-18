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
    [TestCase("01-01-1859", "male",   "010159", new[] { 5, 6, 7, 8 })] 
    [TestCase("15-06-1878", "female", "150678", new[] { 5, 6, 7, 8 })] 
    [TestCase("31-12-1898", "male",   "311298", new[] { 5, 6, 7, 8 })] 
    [TestCase("31-12-1899", "female", "311299", new[] { 5, 6, 7, 8 })] 
    // 1900-1936
    [TestCase("01-01-1900", "male",   "010100", new[] { 0, 1, 2, 3 })] 
    [TestCase("01-01-1901", "female", "010101", new[] { 0, 1, 2, 3 })] 
    [TestCase("15-06-1918", "male",   "150618", new[] { 0, 1, 2, 3 })] 
    [TestCase("31-12-1935", "female", "311235", new[] { 0, 1, 2, 3 })] 
    [TestCase("31-12-1936", "male",   "311236", new[] { 0, 1, 2, 3 })] 
    // 1937-1999
    [TestCase("01-01-1937", "female", "010137", new[] { 0, 1, 2, 3, 4, 9 })] 
    [TestCase("01-01-1938", "male",   "010138", new[] { 0, 1, 2, 3, 4, 9 })] 
    [TestCase("29-02-1968", "female", "290268", new[] { 0, 1, 2, 3, 4, 9 })] 
    [TestCase("31-12-1998", "male",   "311298", new[] { 0, 1, 2, 3, 4, 9 })] 
    [TestCase("31-12-1999", "female", "311299", new[] { 0, 1, 2, 3, 4, 9 })] 
    // 2000-2036
    [TestCase("01-01-2000", "male",   "010100", new[] { 4, 5, 6, 7, 8, 9 })] 
    [TestCase("01-01-2001", "female", "010101", new[] { 4, 5, 6, 7, 8, 9 })] 
    [TestCase("15-06-2018", "male",   "150618", new[] { 4, 5, 6, 7, 8, 9 })] 
    [TestCase("31-12-2035", "female", "311235", new[] { 4, 5, 6, 7, 8, 9 })] 
    [TestCase("31-12-2036", "male",   "311236", new[] { 4, 5, 6, 7, 8, 9 })] 
    // 2037-2057 
    [TestCase("01-01-2037", "female", "010137", new[] { 5, 6, 7, 8 })] 
    [TestCase("01-01-2038", "male",   "010138", new[] { 5, 6, 7, 8 })] 
    [TestCase("15-06-2047", "female", "150647", new[] { 5, 6, 7, 8 })] 
    [TestCase("31-12-2056", "male",   "311256", new[] { 5, 6, 7, 8 })] 
    [TestCase("31-12-2057", "female", "311257", new[] { 5, 6, 7, 8 })] 
    public async Task GenerateCprNumbers(string birthDate, string gender, 
    string expectedDatePart, int[] allowedCenturyDigits)
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
    
    [TestCase("31-12-1857", "male")]   
    [TestCase("01-01-2058", "female")] 
    public void GenerateCprNumbers_OutsideRange(string birthDate, string gender)
    {
        var date = DateOnly.ParseExact(birthDate, "dd-MM-yyyy");

        Assert.CatchAsync<ArgumentException>(async () => await _service.GenerateCprNumber(date, gender));
    }
}
