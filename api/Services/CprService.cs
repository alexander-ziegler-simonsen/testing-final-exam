using System.Text;
using hospitalApi.Data;
using hospitalApi.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace hospitalApi.Services
{

    public class CprService : ICprService
    {

        private HospitalContext _dbContext;

        public CprService(HospitalContext context)
        {
            _dbContext = context;
        }

        public async Task<string> GenerateCprNumber(DateOnly birthDate, string gender)
        {
            const int maxAttempts = 100;

            // outside range
            if (birthDate.Year < 1858 || birthDate.Year > 2057)
                throw new ArgumentOutOfRangeException(nameof(birthDate),
                $"CPR numbers can only be generated for birth years 1858-2057, got {birthDate.Year}.");

            bool isFemale = gender == "female";

            string date = birthDate.ToString("ddMMyy");

            int centuryDigit = GetCenturyDigit(birthDate);

            for (int attempt = 0; attempt < maxAttempts; attempt++)
            {
                string lastDigits = lastRandomNumbers(isFemale);
                string tempCpr = $"{date}{centuryDigit}{lastDigits}";

                bool exists = await _dbContext.Patients.AnyAsync(patient => patient.CprNumber == tempCpr);

                if (!exists)
                    return tempCpr;
            }

            throw new InvalidOperationException(
            $"Could not generate a unique CPR number for {birthDate} after {maxAttempts} attempts.");
        }

        private int GetCenturyDigit(DateOnly year)
        {
            int output = 0;
            Random random = new();

            //1858-1899 = [5, 6, 7, 8]
            if (year.Year >= 1858 && year.Year <= 1899)
            {
                List<int> numbers = [5, 6, 7, 8];
                int randomIndex = random.Next(numbers.Count);
                output = numbers[randomIndex];
            }
            //1900-1936 = [0, 1, 2, 3]
            if (year.Year >= 1900 && year.Year <= 1936)
            {
                List<int> numbers = [0, 1, 2, 3];
                int randomIndex = random.Next(numbers.Count);
                output = numbers[randomIndex];
            }

            //1937-1999 = [0, 1, 2, 3, 4, 9]
            if (year.Year >= 1937 && year.Year <= 1999)
            {
                List<int> numbers = [0, 1, 2, 3, 4, 9];
                int randomIndex = random.Next(numbers.Count);
                output = numbers[randomIndex];
            }

            //2000-2036 = [4, 5, 6, 7, 8, 9]
            if (year.Year >= 2000 && year.Year <= 2036)
            {
                List<int> numbers = [4, 5, 6, 7, 8, 9];
                int randomIndex = random.Next(numbers.Count);
                output = numbers[randomIndex];
            }

            //2037-2057 = [5, 6, 7, 8]
            if (year.Year >= 2037 && year.Year <= 2057)
            {
                List<int> numbers = [5, 6, 7, 8];
                int randomIndex = random.Next(numbers.Count);
                output = numbers[randomIndex];
            }

            return output;
        }

        private string lastRandomNumbers(bool female)
        {
            Random random = new();
            var output = new StringBuilder();

            List<int> lige = [2, 4, 6, 8, 0];
            List<int> ulige = [1, 3, 5, 7, 9];

            output.Append(random.Next(1, 10));
            output.Append(random.Next(1, 10));

            var digits = female ? lige : ulige;
            output.Append(digits[random.Next(digits.Count)]);

            return output.ToString();
        }

    }
}
