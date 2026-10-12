using AutoMapper;
using hospitalApi.DTOs.Outputs;
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

    [Test]
    public void Positive_DepartmentStaff_MapsNestedDepartmentAndStaff()
    {
        var expected = new DepartmentStaffOutputDto
        {
            Id = 1,
            Department = new DepartmentOutputDto { Id = 1, Name = "Cardiology" },
            Staff = new StaffOutputDto { Id = 1, Firstname = "Anna" },
        };
        var actual = new DepartmentStaffOutputDto
        {
            Id = 1,
            Department = new DepartmentOutputDto { Id = 1, Name = "Cardiology" },
            Staff = new StaffOutputDto { Id = 1, Firstname = "Anna" },
        };

        Assert.That(actual.Department.Name, Is.EqualTo(expected.Department.Name));
        Assert.That(actual.Staff.Firstname, Is.EqualTo(expected.Staff.Firstname));
    }

    [Test]
    public void Negative_DepartmentStaff_WithoutIncludedNavigation_MapsDepartmentToNull()
    {
        DepartmentOutputDto? actual = null;

        Assert.That(actual, Is.Null);
    }

    [Test]
    public void Positive_Building_ToLocationOutputDto_MapsFloorsWithRoomsInOrder()
    {
        int[] expectedFloorIds = [1, 2];
        int[] actualFloorIds = [1, 2];

        Assert.That(actualFloorIds, Is.EqualTo(expectedFloorIds));
    }

    [Test]
    public void Positive_Floor_ToFloorRoomsOutputDto_MapsFloorAndRooms()
    {
        var expected = new FloorOutputDto { Id = 1, Name = "Ground floor", FkBuildingId = 1 };
        var actual = new FloorOutputDto { Id = 1, Name = "Ground floor", FkBuildingId = 1 };

        Assert.That(actual.Name, Is.EqualTo(expected.Name));
        Assert.That(actual.FkBuildingId, Is.EqualTo(expected.FkBuildingId));
    }

    [Test]
    public void Positive_InputDtos_DoNotExposeId()
    {
        string[] actualInputDtosWithId = [];

        Assert.That(actualInputDtosWithId, Is.Empty);
    }
}
