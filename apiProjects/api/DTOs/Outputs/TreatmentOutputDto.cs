using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Outputs;

public partial class TreatmentOutputDto
{
    [DefaultValue(1)]
    public int Id { get; set; }

    [DefaultValue(1)]
    public int FkPatientId { get; set; }
    [StringLength(500, MinimumLength = 2)]
    [DefaultValue("fever and headache")]
    public string? Description { get; set; }

    [DefaultValue("2025-10-07T09:00:00")]
    public DateTime Time { get; set; }
}
