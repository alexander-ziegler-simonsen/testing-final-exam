using hospitalApi.Services.Interfaces;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Moq;
using NUnit.Framework;

namespace hospitalApiTesting.Controllers;

public class PatientControllerTest
{
    private WebApplicationFactory<Program> _factory;
    private Mock<IPatientService> _patientServiceMock;
    private Mock<ICprService> _cprServiceMock;

    [SetUp]
    public void Setup()
    {
        _patientServiceMock = new Mock<IPatientService>();
        _cprServiceMock = new Mock<ICprService>();

        _factory = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder =>
            {
                builder.UseSetting("ConnectionStrings:DefaultConnection", "Host=unused-in-tests;Database=unused;Username=unused;Password=unused;");

                builder.ConfigureTestServices(services =>
                {
                    services.RemoveAll<IPatientService>();
                    services.AddScoped(_ => _patientServiceMock.Object);
                    services.RemoveAll<ICprService>();
                    services.AddScoped(_ => _cprServiceMock.Object);
                });
            });
    }

    [TearDown]
    public void TearDown()
    {
        _factory.Dispose();
    }

    [Test]
    public void Test1()
    {
        Assert.Pass();
    }
}
