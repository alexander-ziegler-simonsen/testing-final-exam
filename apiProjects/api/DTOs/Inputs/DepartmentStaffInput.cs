using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Inputs;

public partial class DepartmentStaffInput
{
    public int FkStaffId { get; set; }

    public int FkDepartmentId { get; set; }
}
