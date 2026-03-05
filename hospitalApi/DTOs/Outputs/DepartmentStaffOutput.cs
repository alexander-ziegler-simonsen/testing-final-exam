using System;
using System.Collections.Generic;

namespace hospitalApi.DTOs.Output;

public partial class DepartmentStaffOutput
{
    public int Id { get; set; }

    public int FkStaffId { get; set; }

    public int FkDepartmentId { get; set; }
}
