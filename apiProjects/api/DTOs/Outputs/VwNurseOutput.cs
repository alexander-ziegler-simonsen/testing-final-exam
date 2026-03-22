using System;
using System.Collections.Generic;

namespace hospitalApi.DTOs.Outputs;

public partial class VwNurseOutput
{
    public int? NurseId { get; set; }

    public string? Firstname { get; set; }

    public string? Lastname { get; set; }

    public int? DepartmentId { get; set; }

    public string? DepartmentName { get; set; }

    public int? ShiftId { get; set; }

    public DateTime? ShiftStart { get; set; }

    public DateTime? ShiftEnd { get; set; }
}
