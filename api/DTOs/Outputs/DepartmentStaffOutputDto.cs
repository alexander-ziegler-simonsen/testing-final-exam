
namespace hospitalApi.DTOs.Outputs
{
    public class DepartmentStaffOutputDto
    {
        public int Id { get; set; }
        public required DepartmentOutputDto Department { get; set; }
        public required StaffOutputDto Staff { get; set; }
    }
}
