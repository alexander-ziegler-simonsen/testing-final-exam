using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Inputs;

public partial class DepartmentStaffInputDto
{
    public int FkStaffId { get; set; }

    public int FkDepartmentId { get; set; }
}
