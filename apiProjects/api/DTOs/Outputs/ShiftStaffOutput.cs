using System;
using System.Collections.Generic;

namespace hospitalApi.DTOs.Output;

public partial class ShiftStaffOutput
{
    public int Id { get; set; }

    public int FkShiftId { get; set; }

    public int FkStaffId { get; set; }
}
