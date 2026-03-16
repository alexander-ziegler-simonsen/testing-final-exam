using System;
using System.Collections.Generic;

namespace hospitalApi.DTOs.Inputs;

public partial class ShiftInput
{
    public int Id { get; set; }

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }
}
