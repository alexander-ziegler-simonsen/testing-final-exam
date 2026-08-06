using hospitalApi.Services.Interfaces;

namespace hospitalApi.Services
{
    // Danish CPR number: DDMMYY-SSSS, 10 digits, no DB/HTTP dependency by design
    // (a pure, deterministic unit of business logic - a good unit-test target
    // compared to the mostly CRUD/EF-Core-backed services elsewhere in this project).
    //
    // Century decision table for digit 7 (the first digit of SSSS), combined with YY:
    //   digit 0-3          -> always 19xx
    //   digit 4 or 9        -> YY 00-36 => 20xx, YY 37-99 => 19xx
    //   digit 5-8           -> YY 00-57 => 20xx, YY 58-99 => 18xx
    // This means century 1900 can always be encoded with digit '0', and both
    // century 1800 and 2000 can be encoded with digit '5' (the YY value alone
    // then disambiguates which of the two applies).
    public class CprService : ICprService
    {
        private static readonly DateOnly MinEncodableDate = new(1858, 1, 1);
        private static readonly DateOnly MaxEncodableDate = new(2057, 12, 31);

        public string GenerateCprNumber(DateOnly birthDate, string gender)
        {
            if (birthDate < MinEncodableDate || birthDate > MaxEncodableDate)
                throw new ArgumentOutOfRangeException(nameof(birthDate),
                    $"CPR numbers can only encode birth dates between {MinEncodableDate:yyyy-MM-dd} and {MaxEncodableDate:yyyy-MM-dd}.");

            bool isFemale = gender?.Trim().ToLowerInvariant() switch
            {
                "female" => true,
                "male" => false,
                _ => throw new ArgumentException("Gender must be \"male\" or \"female\".", nameof(gender))
            };

            string dayMonthYear = birthDate.ToString("ddMMyy");
            char centuryDigit = birthDate.Year is >= 1900 and <= 1999 ? '0' : '5';
            const string freeDigits = "00";
            char genderDigit = isFemale ? '0' : '1';

            return $"{dayMonthYear}{centuryDigit}{freeDigits}{genderDigit}";
        }

        public bool IsValid(string? cprNumber)
        {
            if (string.IsNullOrEmpty(cprNumber) || cprNumber.Length != 10)
                return false;

            if (!cprNumber.All(char.IsAsciiDigit))
                return false;

            int day = int.Parse(cprNumber.Substring(0, 2));
            int month = int.Parse(cprNumber.Substring(2, 2));
            int yy = int.Parse(cprNumber.Substring(4, 2));
            int centuryDigit = cprNumber[6] - '0';

            int century = ResolveCentury(centuryDigit, yy);
            int fullYear = century + yy;

            return IsValidCalendarDate(fullYear, month, day);
        }

        private static int ResolveCentury(int centuryDigit, int yy) => centuryDigit switch
        {
            >= 0 and <= 3 => 1900,
            4 or 9 => yy <= 36 ? 2000 : 1900,
            >= 5 and <= 8 => yy <= 57 ? 2000 : 1800,
            _ => 1900
        };

        private static bool IsValidCalendarDate(int year, int month, int day)
        {
            if (month < 1 || month > 12)
                return false;

            return day >= 1 && day <= DateTime.DaysInMonth(year, month);
        }
    }
}
