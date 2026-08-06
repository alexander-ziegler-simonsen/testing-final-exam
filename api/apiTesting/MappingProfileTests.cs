using AutoMapper;
using hospitalApi.Mapping;
using Microsoft.Extensions.Logging.Abstractions;

namespace hospitalApiTesting;

public class MappingProfileTests
{
    // An AutoMapper typo or a missing CreateMap<>() only shows up in Postman
    // as one specific field silently coming back null/0 on one endpoint -
    // and only if a request happens to assert on that exact property. This
    // single test statically validates every mapping in the profile at once.
    [Test]
    public void MappingProfile_Configuration_IsValid()
    {
        var configuration = new MapperConfiguration(
            cfg => cfg.AddProfile<MappingProfile>(),
            NullLoggerFactory.Instance);

        configuration.AssertConfigurationIsValid();
    }
}
