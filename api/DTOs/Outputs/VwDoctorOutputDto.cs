using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Outputs;

public partial class VwDoctorOutputDto
{
    [DefaultValue(1)]
    public int? DoctorId { get; set; }
    [StringLength(100, MinimumLength = 2)]
    [DefaultValue("lars")]
    public string? Firstname { get; set; }
    [StringLength(100, MinimumLength = 2)]
    [DefaultValue("christensen")]
    public string? Lastname { get; set; }

    [DefaultValue(1)]
    public int? DepartmentId { get; set; }
    [StringLength(100, MinimumLength = 2)]
    [DefaultValue("emergency")]
    public string? DepartmentName { get; set; }
}
