using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Inputs;

public partial class ShiftInputDto
{
    [DefaultValue(typeof(DateTime), "2025-10-07T08:00:00")]
    public DateTime StartTime { get; set; }

    [DefaultValue(typeof(DateTime), "2025-10-07T16:00:00")]
    public DateTime EndTime { get; set; }
}
