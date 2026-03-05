using System;
using System.Collections.Generic;

namespace hospitalApi.Models;

public partial class ShiftStaff
{
    public int Id { get; set; }

    public int FkShiftId { get; set; }

    public int FkStaffId { get; set; }

    public virtual Shift FkShift { get; set; } = null!;

    public virtual Staff FkStaff { get; set; } = null!;
}
