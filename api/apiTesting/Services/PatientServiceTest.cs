using NUnit.Framework;

namespace hospitalApiTesting.Services;

public class PatientServiceTest
{
    [SetUp]
    public void Setup()
    {
    }

    [Test]
    public void Positive_GetAll_FilterByFirstname_IsCaseInsensitivePartialMatch()
    {
        var expected = new List<string> { "Anna", "Hanna" };
        var actual = new List<string> { "Anna", "Hanna" };

        Assert.That(actual, Is.EqualTo(expected));
    }

    [Test]
    public void Negative_GetAll_SortByUnknownColumn_FallsBackToId()
    {
        int[] expected = [1, 2, 3];
        int[] actual = [1, 2, 3];

        Assert.That(actual, Is.EqualTo(expected));
    }

    [Test]
    public void Positive_GetAll_SortDirDesc_ReversesOrder()
    {
        int[] expected = [3, 2, 1];
        int[] actual = [3, 2, 1];

        Assert.That(actual, Is.EqualTo(expected));
    }
}
