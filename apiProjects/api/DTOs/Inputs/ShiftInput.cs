using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Inputs;

public partial class ShiftInput
{
    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }
}
