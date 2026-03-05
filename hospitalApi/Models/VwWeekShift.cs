using System;
using System.Collections.Generic;

namespace hospitalApi.Models;

public partial class VwWeekShift
{
    public int? ShiftId { get; set; }

    public DateTime? StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    public int? StaffId { get; set; }

    public string? Firstname { get; set; }

    public string? Lastname { get; set; }

    public string? StaffRole { get; set; }
}
