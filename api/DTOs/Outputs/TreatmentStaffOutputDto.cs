using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Outputs;

public partial class TreatmentStaffOutputDto
{
    public int Id { get; set; }

    public int FkTreatmentId { get; set; }

    public int FkStaffId { get; set; }

}
