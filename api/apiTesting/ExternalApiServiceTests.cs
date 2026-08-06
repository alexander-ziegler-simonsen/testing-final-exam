using System.Net;
using hospitalApi.Services;
using Moq;
using Moq.Protected;

namespace hospitalApiTesting;

public class ExternalApiServiceTests
{
    // This is a UNIT test that can't be produced via Postman: we cannot make
    // the real, live third-party medicine-price API return a 500 on demand.
    // Mocking HttpMessageHandler simulates that failure locally and proves
    // the service does not swallow it (EnsureSuccessStatusCode should let
    // HttpRequestException through).
    [Test]
    public void GetMedicineProductsByNameAsync_WhenExternalApiReturns500_ThrowsHttpRequestException()
    {
        var handlerMock = new Mock<HttpMessageHandler>();
        handlerMock
            .Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.InternalServerError
            });

        var httpClient = new HttpClient(handlerMock.Object)
        {
            BaseAddress = new Uri("https://example.test/")
        };
        var service = new ExternalApiService(httpClient);

        Assert.ThrowsAsync<HttpRequestException>(
            async () => await service.GetMedicineProductsByNameAsync("panodil"));
    }
}
