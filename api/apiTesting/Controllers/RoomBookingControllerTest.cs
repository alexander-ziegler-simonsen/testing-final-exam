using hospitalApi.Services.Interfaces;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Moq;
using NUnit.Framework;

namespace hospitalApiTesting.Controllers;

public class RoomBookingControllerTest
{
    private WebApplicationFactory<Program> _factory;
    private Mock<IRoomBookingService> _roomBookingServiceMock;

    [SetUp]
    public void Setup()
    {
        _roomBookingServiceMock = new Mock<IRoomBookingService>();

        _factory = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder =>
            {
                builder.UseSetting("ConnectionStrings:DefaultConnection", "Host=unused-in-tests;Database=unused;Username=unused;Password=unused;");

                builder.ConfigureTestServices(services =>
                {
                    services.RemoveAll<IRoomBookingService>();
                    services.AddScoped(_ => _roomBookingServiceMock.Object);
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
