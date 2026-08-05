using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Outputs;

public partial class ShiftOutputDto
{
    [DefaultValue(1)]
    public int Id { get; set; }

    [DefaultValue("2025-10-07T08:00:00")]
    public DateTime StartTime { get; set; }

    [DefaultValue("2025-10-07T16:00:00")]
    public DateTime EndTime { get; set; }
}
