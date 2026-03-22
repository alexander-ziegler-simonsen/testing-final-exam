using System;
using System.Collections.Generic;

namespace hospitalApi.DTOs.Outputs;

public partial class DepartmentStaffOutput
{
    public int Id { get; set; }

    public int FkStaffId { get; set; }

    public int FkDepartmentId { get; set; }
}
