using System;
using System.Collections.Generic;

namespace hospitalApi.DTOs.Output;

public partial class VwWeekShiftOutput
{
    public int? ShiftId { get; set; }

    public DateTime? StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    public int? StaffId { get; set; }

    public string? Firstname { get; set; }

    public string? Lastname { get; set; }

    public string? StaffRole { get; set; }
}
