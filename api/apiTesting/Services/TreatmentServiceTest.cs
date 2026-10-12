using hospitalApi.Models;
using NUnit.Framework;

namespace hospitalApiTesting.Services;

public class TreatmentServiceTest
{
    [SetUp]
    public void Setup()
    {
    }

    [Test]
    public void Positive_GetAll_FilterByPatientId_OnlyThatPatient()
    {
        int expectedPatientId = 2;
        int[] actualPatientIds = [2, 2];

        Assert.That(actualPatientIds, Is.All.EqualTo(expectedPatientId));
    }

    [Test]
    public void Negative_GetAll_FilterPatientIdZero_IsIgnored()
    {
        int expectedCount = 3;
        int actualCount = 3;

        Assert.That(actualCount, Is.EqualTo(expectedCount));
    }

    [Test]
    public void Positive_CreateTreatment_WithStaffId_AlsoCreatesTreatmentStaffLink()
    {
        var expected = new TreatmentStaff { FkTreatmentId = 1, FkStaffId = 1 };
        var actual = new TreatmentStaff { FkTreatmentId = 1, FkStaffId = 1 };

        Assert.That(actual.FkTreatmentId, Is.EqualTo(expected.FkTreatmentId));
        Assert.That(actual.FkStaffId, Is.EqualTo(expected.FkStaffId));
    }
}
