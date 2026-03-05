using System;
using System.Collections.Generic;

namespace hospitalApi.DTOs.Inputs;

public partial class TreatmentStaffInput
{
    public int Id { get; set; }

    public int FkTreatmentId { get; set; }

    public int FkStaffId { get; set; }

}
