using hospitalApi.Controllers;
using hospitalApi.Services.Interfaces;
using Moq;
using NUnit.Framework;

namespace hospitalApiTesting;

public class simpleTest
{
    private Mock<IDepartmentService> _departmentServiceMock;
    private DepartmentController _controller;

    [SetUp]
    public void Setup()
    {
        _departmentServiceMock = new Mock<IDepartmentService>();
        _controller = new DepartmentController(_departmentServiceMock.Object);
    }

    // This is a UNIT test: it only checks the controller's behaviour in isolation,
    // using a mocked (fake) service. It does NOT make a real HTTP call, so it
    // cannot see an actual "500" status code - that only exists once ASP.NET
    // Core's pipeline turns an unhandled exception into an HTTP response.
    // What this test *can* prove: if the service fails, the controller does not
    // hide the error (e.g. by swallowing it and returning Ok() with empty data).
    // That "don't hide errors" behaviour is exactly what allows the framework
    // to produce a 500 response later, in production.
    [Test]
    public void Get_WhenServiceThrows_ControllerDoesNotSwallowTheException()
    {
        // Arrange: make the fake service throw, simulating a real failure
        // (e.g. a database connection error).
        var expectedException = new InvalidOperationException("Database connection failed");
        _departmentServiceMock
            .Setup(s => s.GetOne(1))
            .ThrowsAsync(expectedException);

        // Act + Assert: calling the controller should let that same exception
        // through, not catch it and return a normal response.
        var thrown = Assert.ThrowsAsync<InvalidOperationException>(
            async () => await _controller.Get(1));
        Assert.That(thrown.Message, Is.EqualTo("Database connection failed"));

        // Extra check: confirm the controller actually called the service
        // with the id we passed in, so we know the failure path we tested
        // is the one that really runs.
        _departmentServiceMock.Verify(s => s.GetOne(1), Times.Once);
    }
}
