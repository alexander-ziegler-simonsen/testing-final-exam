using System;
using System.Collections.Generic;

namespace hospitalApi.DTOs.Inputs;

public partial class DepartmentStaffInput
{
    public int FkStaffId { get; set; }

    public int FkDepartmentId { get; set; }
}
