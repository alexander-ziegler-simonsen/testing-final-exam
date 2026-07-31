using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Outputs;

public partial class VwDoctorOutput
{
    public int? DoctorId { get; set; }
    [StringLength(100, MinimumLength = 2)]
    public string? Firstname { get; set; }
    [StringLength(100, MinimumLength = 2)]
    public string? Lastname { get; set; }

    public int? DepartmentId { get; set; }
    [StringLength(100, MinimumLength = 2)]
    public string? DepartmentName { get; set; }
}
