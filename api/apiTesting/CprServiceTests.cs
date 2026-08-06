using hospitalApi.Services;
using NUnit.Framework;

namespace hospitalApiTesting;

public class CprServiceTests
{
    private CprService _service;

    [SetUp]
    public void Setup()
    {
        _service = new CprService();
    }

    // --- Structural equivalence classes: format before we even look at the date ---
    [TestCase(null, ExpectedResult = false)]
    [TestCase("", ExpectedResult = false)]
    [TestCase("010190000", ExpectedResult = false)]   // 9 digits: one short of the boundary
    [TestCase("01019000011", ExpectedResult = false)]  // 11 digits: one past the boundary
    [TestCase("01019000A1", ExpectedResult = false)]   // right length, non-digit character
    [TestCase("010190-001", ExpectedResult = false)]   // right length, contains a dash
    public bool IsValid_StructuralCases(string? cpr) => _service.IsValid(cpr);

    // --- Calendar validity (EP + BVA), all pinned to century digit '0' (=> 19xx)
    // so these cases isolate the date-checking branch from the century table. ---
    [TestCase("300490" + "0001", ExpectedResult = true)]  // Apr 30: valid boundary (last day of a 30-day month)
    [TestCase("310490" + "0001", ExpectedResult = false)] // Apr 31: invalid, one past that boundary
    [TestCase("000190" + "0001", ExpectedResult = false)] // day 00: below range
    [TestCase("010090" + "0001", ExpectedResult = false)] // month 00: below range
    [TestCase("010190" + "0001", ExpectedResult = true)]  // Jan 1: valid low boundary
    [TestCase("011390" + "0001", ExpectedResult = false)] // month 13: above range
    [TestCase("290299" + "0001", ExpectedResult = false)] // Feb 29, 1999 (not a leap year)
    [TestCase("290296" + "0001", ExpectedResult = true)]  // Feb 29, 1996 (leap year)
    public bool IsValid_CalendarCases(string cpr) => _service.IsValid(cpr);

    // --- Century decision table: digit 7 (the first digit of SSSS) x YY -> century.
    // Each row below is chosen so a wrong century produces a different, checkable
    // leap-year outcome for Feb 29 - i.e. getting the century wrong flips the result.
    //   digit 0-3          -> always 19xx
    //   digit 4 or 9        -> YY 00-36 => 20xx, YY 37-99 => 19xx
    //   digit 5-8           -> YY 00-57 => 20xx, YY 58-99 => 18xx
    [TestCase("290200" + "0001", ExpectedResult = false, TestName = "Digit0_Yy00_MustStayIn1900s_NotSlipTo2000")] // digit 0 forces 1900 even though yy=00 "looks like" 2000; 1900 is not a leap year
    [TestCase("290236" + "4001", ExpectedResult = true, TestName = "Digit4_Yy36_JustInside2000sThreshold")]        // yy=36 => 2036, a leap year
    [TestCase("290237" + "4001", ExpectedResult = false, TestName = "Digit4_Yy37_JustOutside2000sThreshold")]      // yy=37 => 1937, not a leap year
    [TestCase("290236" + "9001", ExpectedResult = true, TestName = "Digit9_BehavesLikeDigit4")]                    // yy=36 => 2036, leap year
    [TestCase("290200" + "5001", ExpectedResult = true, TestName = "Digit5_Yy00_2000sSide_LeapViaDiv400Rule")]     // yy=00 => 2000, leap (div by 400)
    [TestCase("290299" + "8001", ExpectedResult = false, TestName = "Digit8_Yy99_1800sSide_NotLeap")]              // yy=99 => 1899, not leap
    public bool IsValid_CenturyTableCases(string cpr) => _service.IsValid(cpr);

    [Test]
    public void GenerateCprNumber_ForMaleAndFemale_SetsCorrectGenderDigitParity()
    {
        var male = _service.GenerateCprNumber(new DateOnly(1990, 1, 1), "male");
        var female = _service.GenerateCprNumber(new DateOnly(1990, 1, 1), "female");

        Assert.That(int.Parse(male[^1..]) % 2, Is.EqualTo(1));
        Assert.That(int.Parse(female[^1..]) % 2, Is.EqualTo(0));
    }

    [TestCase(1858, 1, 1)]   // lower boundary of the encodable range: accepted
    [TestCase(2057, 12, 31)] // upper boundary of the encodable range: accepted
    [TestCase(1990, 1, 1)]   // ordinary 20th-century date
    [TestCase(2010, 5, 20)]  // ordinary 21st-century date
    public void GenerateCprNumber_ThenIsValid_RoundTripsForEncodableDates(int year, int month, int day)
    {
        var cpr = _service.GenerateCprNumber(new DateOnly(year, month, day), "male");

        Assert.That(_service.IsValid(cpr), Is.True);
    }

    [TestCase(1857, 12, 31)] // one day before the lower boundary
    [TestCase(2058, 1, 1)]   // one day after the upper boundary
    public void GenerateCprNumber_ForDatesOutsideEncodableRange_Throws(int year, int month, int day)
    {
        Assert.Throws<ArgumentOutOfRangeException>(() =>
            _service.GenerateCprNumber(new DateOnly(year, month, day), "male"));
    }

    [TestCase("")]
    [TestCase("other")]
    public void GenerateCprNumber_ForInvalidGender_Throws(string gender)
    {
        Assert.Throws<ArgumentException>(() =>
            _service.GenerateCprNumber(new DateOnly(1990, 1, 1), gender));
    }
}
