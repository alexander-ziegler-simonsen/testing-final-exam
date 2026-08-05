using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Outputs;

public partial class VwNurseOutputDto
{
    [DefaultValue(26)]
    public int? NurseId { get; set; }
    [StringLength(100, MinimumLength = 2)]
    [DefaultValue("anna")]
    public string? Firstname { get; set; }
    [StringLength(100, MinimumLength = 2)]
    [DefaultValue("jensen")]
    public string? Lastname { get; set; }

    [DefaultValue(1)]
    public int? DepartmentId { get; set; }
    [StringLength(100, MinimumLength = 2)]
    [DefaultValue("emergency")]
    public string? DepartmentName { get; set; }

    [DefaultValue(1)]
    public int? ShiftId { get; set; }

    [DefaultValue("2025-10-07T08:00:00")]
    public DateTime? ShiftStart { get; set; }

    [DefaultValue("2025-10-07T16:00:00")]
    public DateTime? ShiftEnd { get; set; }
}
