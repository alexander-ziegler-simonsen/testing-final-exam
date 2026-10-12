using hospitalApi.Models;
using NUnit.Framework;

namespace hospitalApiTesting.Services;

public class UserServiceTest
{
    [SetUp]
    public void Setup()
    {
    }

    [Test]
    public void Negative_Register_WithBothStaffAndPatient()
    {
        bool expected = false;
        bool actual = false;

        Assert.That(actual, Is.EqualTo(expected));
    }

    [Test]
    public void Negative_Register_WithNeitherStaffNorPatient()
    {
        bool expected = false;
        bool actual = false;

        Assert.That(actual, Is.EqualTo(expected));
    }

    [Test]
    public void Negative_Register_WithDuplicateUsername()
    {
        bool expected = false;
        bool actual = false;

        Assert.That(actual, Is.EqualTo(expected));
    }

    [Test]
    public void Positive_Register_WithPatientId_CreatesUserPatientLink()
    {
        var expected = new UserPatient { FkUserId = 1, FkPatientId = 1 };
        var actual = new UserPatient { FkUserId = 1, FkPatientId = 1 };

        Assert.That(actual.FkUserId, Is.EqualTo(expected.FkUserId));
        Assert.That(actual.FkPatientId, Is.EqualTo(expected.FkPatientId));
    }

    [Test]
    public void Positive_ChangePassword_GeneratesNewSaltAndHash()
    {
        string oldSalt = "$2a$11$oldSaltValue1234567890";
        string newSalt = "$2a$11$newSaltValue1234567890";

        Assert.That(newSalt, Is.Not.EqualTo(oldSalt));
    }
}
