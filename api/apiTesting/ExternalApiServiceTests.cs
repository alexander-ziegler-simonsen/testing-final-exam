using System.Net;
using System.Text;
using hospitalApi.Services;
using Moq;
using Moq.Protected;

namespace hospitalApiTesting;

[TestFixture]
public class ExternalApiServiceTests
{
    private Mock<HttpMessageHandler> _handlerMock = null!;
    private HttpClient _httpClient = null!;
    private ExternalApiService _service = null!;

    [SetUp]
    public void SetUp()
    {
        _handlerMock = new Mock<HttpMessageHandler>();
        _httpClient = new HttpClient(_handlerMock.Object)
        {
            BaseAddress = new Uri("http://api.medicinpriser.dk/v1/")
        };
        _service = new ExternalApiService(_httpClient);
    }

    [TearDown]
    public void TearDown() => _httpClient.Dispose();

    // helpers

    private void SetupResponse(HttpStatusCode status, string body)
    {
        _handlerMock
            .Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = status,
                Content = new StringContent(body, Encoding.UTF8, "application/json"),
            });
    }

    private void VerifyRequest(string expectedRelativePath)
    {
        _handlerMock.Protected().Verify(
            "SendAsync",
            Times.Once(),
            ItExpr.Is<HttpRequestMessage>(req =>
                req.RequestUri!.PathAndQuery.Contains(expectedRelativePath)),
            ItExpr.IsAny<CancellationToken>());
    }

    // Sample JSON payloads
    private const string ProductListJson = @"[
          {
            ""navn"": ""Paracetamol"",
            ""varenummer"": ""001"",
            ""firma"": ""Acme"",
            ""styrke"": ""500 mg"",
            ""detaljer"": ""/produkter/detaljer/001"",
            ""pakning"": ""20 stk""
          },
          {
            ""navn"": ""Ibuprofen"",
            ""varenummer"": ""002"",
            ""firma"": ""Pharma"",
            ""styrke"": ""400 mg"",
            ""detaljer"": ""/produkter/detaljer/002"",
            ""pakning"": ""30 stk""
          }
        ]";

    private const string SingleProductJson = @"[
          {
            ""navn"": ""Paracetamol"",
            ""varenummer"": ""001"",
            ""firma"": ""Acme"",
            ""styrke"": ""500 mg"",
            ""detaljer"": ""/produkter/detaljer/001"",
            ""pakning"": ""20 stk""
          }
        ]";

    private const string DetailJson = @"{
          ""navn"": ""Paracetamol"",
          ""varenummer"": ""001"",
          ""styrke"": ""500 mg"",
          ""pakning"": ""20 stk"",
          ""virksomtStof"": ""Paracetamol"",
          ""firma"": ""Acme"",
          ""atcKode"": ""N02BE01"",
          ""dosisdispensering"": false,
          ""udgaaet"": false,
          ""trafikAdvarsel"": false,
          ""haandkoeb"": true,
          ""prisPrPakning"": ""45.50""
        }";

    // GetMedicineProductsByNameAsync 

    [Test]
    public async Task GetByName_ReturnsDeserializedProducts()
    {
        SetupResponse(HttpStatusCode.OK, ProductListJson);

        var result = (await _service.GetMedicineProductsByNameAsync("Paracetamol")).ToList();

        Assert.That(result, Has.Count.EqualTo(2));
        Assert.That(result[0].Navn, Is.EqualTo("Paracetamol"));
        Assert.That(result[0].Varenummer, Is.EqualTo("001"));
        Assert.That(result[1].Navn, Is.EqualTo("Ibuprofen"));
    }

    [Test]
    public async Task GetByName_CallsCorrectEndpoint()
    {
        SetupResponse(HttpStatusCode.OK, ProductListJson);

        await _service.GetMedicineProductsByNameAsync("Paracetamol");

        VerifyRequest("produkter/Paracetamol");
    }

    [Test]
    public async Task GetByName_WhenJsonUsesLowerCaseKeys_StillDeserializesCorrectly()
    {
        var lowercaseJson = @"[{""navn"":""Test"",""varenummer"":""123"",""firma"":""Acme"",""styrke"":""100mg"",""detaljer"":""/d"",""pakning"":""10 stk""}]";
        SetupResponse(HttpStatusCode.OK, lowercaseJson);

        var result = (await _service.GetMedicineProductsByNameAsync("Test")).ToList();

        Assert.That(result[0].Varenummer, Is.EqualTo("123"));
    }

    [Test]
    public void GetByName_WhenApiReturnsError_ThrowsHttpRequestException()
    {
        SetupResponse(HttpStatusCode.NotFound, "{}");

        Assert.ThrowsAsync<HttpRequestException>(
            () => _service.GetMedicineProductsByNameAsync("Unknown"));
    }

    [Test]
    public void GetByName_WhenApiReturnsServerError_ThrowsHttpRequestException()
    {
        SetupResponse(HttpStatusCode.InternalServerError, "{}");

        Assert.ThrowsAsync<HttpRequestException>(
            () => _service.GetMedicineProductsByNameAsync("Anything"));
    }

    // GetMedicineProductsByIngredientsAsync

    [Test]
    public async Task GetByIngredient_ReturnsDeserializedProducts()
    {
        SetupResponse(HttpStatusCode.OK, SingleProductJson);

        var result = (await _service.GetMedicineProductsByIngredientsAsync("Paracetamol")).ToList();

        Assert.That(result, Has.Count.EqualTo(1));
        Assert.That(result[0].Firma, Is.EqualTo("Acme"));
    }

    [Test]
    public async Task GetByIngredient_CallsCorrectEndpoint()
    {
        SetupResponse(HttpStatusCode.OK, SingleProductJson);

        await _service.GetMedicineProductsByIngredientsAsync("Ibuprofen");

        VerifyRequest("produkter/virksomtstof/Ibuprofen");
    }

    [Test]
    public void GetByIngredient_WhenApiReturnsError_ThrowsHttpRequestException()
    {
        SetupResponse(HttpStatusCode.ServiceUnavailable, "{}");

        Assert.ThrowsAsync<HttpRequestException>(
            () => _service.GetMedicineProductsByIngredientsAsync("x"));
    }

    // GetMedicineProductDetailsAsync

    [Test]
    public async Task GetDetails_ReturnsDeserializedDetail()
    {
        SetupResponse(HttpStatusCode.OK, DetailJson);

        var result = await _service.GetMedicineProductDetailsAsync("001");

        Assert.That(result, Is.Not.Null);
        Assert.That(result.Navn, Is.EqualTo("Paracetamol"));
        Assert.That(result.AtcKode, Is.EqualTo("N02BE01"));
        Assert.That(result.PrisPrPakning, Is.EqualTo("45.50"));
        Assert.That(result.Haandkoeb, Is.True);
        Assert.That(result.Udgaaet, Is.False);
    }

    [Test]
    public async Task GetDetails_CallsCorrectEndpoint()
    {
        SetupResponse(HttpStatusCode.OK, DetailJson);

        await _service.GetMedicineProductDetailsAsync("001");

        VerifyRequest("produkter/detaljer/001");
    }

    [Test]
    public async Task GetDetails_WhenNullableFieldsMissing_DeserializesWithNulls()
    {
        var minimalJson = @"{""dosisdispensering"":false,""udgaaet"":false,""trafikAdvarsel"":false,""haandkoeb"":false}";
        SetupResponse(HttpStatusCode.OK, minimalJson);

        var result = await _service.GetMedicineProductDetailsAsync("999");

        Assert.That(result.Navn, Is.Null);
        Assert.That(result.VirksomtStof, Is.Null);
    }

    [Test]
    public void GetDetails_WhenApiReturnsError_ThrowsHttpRequestException()
    {
        SetupResponse(HttpStatusCode.NotFound, "{}");

        Assert.ThrowsAsync<HttpRequestException>(
            () => _service.GetMedicineProductDetailsAsync("999"));
    }
}
