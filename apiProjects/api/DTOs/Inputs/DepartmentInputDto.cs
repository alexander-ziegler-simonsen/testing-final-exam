using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Inputs;

public partial class DepartmentInputDto
{
    [StringLength(100, MinimumLength = 2)]
    public string? Name { get; set; }
    [StringLength(100, MinimumLength = 2)]
    public string? Type { get; set; }
}
