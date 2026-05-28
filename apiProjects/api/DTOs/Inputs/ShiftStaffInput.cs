using System;
using System.Collections.Generic;

namespace hospitalApi.DTOs.Inputs;

public partial class ShiftStaffInput
{
    public int FkShiftId { get; set; }

    public int FkStaffId { get; set; }
}
