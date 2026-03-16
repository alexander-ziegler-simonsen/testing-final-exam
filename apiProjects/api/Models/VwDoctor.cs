using System;
using System.Collections.Generic;

namespace hospitalApi.Models;

public partial class VwDoctor
{
    public int? DoctorId { get; set; }

    public string? Firstname { get; set; }

    public string? Lastname { get; set; }

    public int? DepartmentId { get; set; }

    public string? DepartmentName { get; set; }
}
