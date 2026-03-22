using System;
using System.Collections.Generic;

namespace hospitalApi.DTOs.Outputs;

public partial class ShiftOutput
{
    public int Id { get; set; }

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }
}
