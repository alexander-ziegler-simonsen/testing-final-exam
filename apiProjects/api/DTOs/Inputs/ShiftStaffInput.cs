using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Inputs;

public partial class ShiftStaffInput
{
    public int FkShiftId { get; set; }

    public int FkStaffId { get; set; }
}
