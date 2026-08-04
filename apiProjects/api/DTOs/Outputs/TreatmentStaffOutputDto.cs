using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Outputs;

public partial class TreatmentStaffOutputDto
{
    [DefaultValue(1)]
    public int Id { get; set; }

    [DefaultValue(1)]
    public int FkTreatmentId { get; set; }

    [DefaultValue(1)]
    public int FkStaffId { get; set; }

}
