using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Inputs;

public partial class TreatmentStaffInput
{
    public int FkTreatmentId { get; set; }

    public int FkStaffId { get; set; }

}
