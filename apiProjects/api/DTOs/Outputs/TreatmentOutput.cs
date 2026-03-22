using System;
using System.Collections.Generic;

namespace hospitalApi.DTOs.Outputs;

public partial class TreatmentOutput
{
    public int Id { get; set; }

    public int FkPatientId { get; set; }

    public string? Description { get; set; }

    public DateTime Time { get; set; }
}
