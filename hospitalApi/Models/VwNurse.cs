using System;
using System.Collections.Generic;

namespace hospitalApi.Models;

public partial class VwNurse
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
