using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Inputs;

public partial class TreatmentStaffInputDto
{
    [DefaultValue(1)]
    public int FkTreatmentId { get; set; }

    [DefaultValue(1)]
    public int FkStaffId { get; set; }

}
