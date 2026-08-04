using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Inputs;

public partial class DepartmentStaffInputDto
{
    [DefaultValue(1)]
    public int FkStaffId { get; set; }

    [DefaultValue(1)]
    public int FkDepartmentId { get; set; }
}
