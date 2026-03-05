using System;
using System.Collections.Generic;

namespace hospitalApi.DTOs.Output;

public partial class TreatmentStaffOutput
{
    public int Id { get; set; }

    public int FkTreatmentId { get; set; }

    public int FkStaffId { get; set; }

}
