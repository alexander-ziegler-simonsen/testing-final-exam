using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Inputs;

public partial class ShiftStaffInputDto
{
    public int FkShiftId { get; set; }

    public int FkStaffId { get; set; }
}
