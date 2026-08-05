using System;
using System.Collections.Generic;

namespace hospitalApi.Models;

public partial class Shift
{
    public int Id { get; set; }

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }

    public virtual ICollection<ShiftStaff> ShiftStaffs { get; set; } = new List<ShiftStaff>();
}
