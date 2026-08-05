using System;
using System.Collections.Generic;

namespace hospitalApi.Models;

public partial class TreatmentStaff
{
    public int Id { get; set; }

    public int FkTreatmentId { get; set; }

    public int FkStaffId { get; set; }

    public virtual Staff FkStaff { get; set; } = null!;

    public virtual Treatment FkTreatment { get; set; } = null!;
}
