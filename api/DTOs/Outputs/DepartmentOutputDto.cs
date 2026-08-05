using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Outputs;

public partial class DepartmentOutputDto
{
    [DefaultValue(1)]
    public int Id { get; set; }
    [StringLength(100, MinimumLength = 2)]
    [DefaultValue("emergency")]
    public string? Name { get; set; }
    [StringLength(100, MinimumLength = 2)]
    [DefaultValue("critical care")]
    public string? Type { get; set; }
}
