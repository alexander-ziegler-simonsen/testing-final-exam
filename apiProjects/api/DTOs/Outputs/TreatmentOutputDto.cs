using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Outputs;

public partial class TreatmentOutputDto
{
    public int Id { get; set; }

    public int FkPatientId { get; set; }
    [StringLength(500, MinimumLength = 2)]
    public string? Description { get; set; }

    public DateTime Time { get; set; }
}
