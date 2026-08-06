using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Outputs;

public partial class VwWeekShiftOutputDto
{
    [DefaultValue(1)]
    public int? ShiftId { get; set; }

    [DefaultValue(typeof(DateTime), "2025-10-07T08:00:00")]
    public DateTime? StartTime { get; set; }

    [DefaultValue(typeof(DateTime), "2025-10-07T16:00:00")]
    public DateTime? EndTime { get; set; }

    [DefaultValue(1)]
    public int? StaffId { get; set; }
    [StringLength(100, MinimumLength = 2)]
    [DefaultValue("lars")]
    public string? Firstname { get; set; }
    [StringLength(100, MinimumLength = 2)]
    [DefaultValue("christensen")]
    public string? Lastname { get; set; }
    [StringLength(50, MinimumLength = 2)]
    [DefaultValue("doctor")]
    public string? StaffRole { get; set; }
}
