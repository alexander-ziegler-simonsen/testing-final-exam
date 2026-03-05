using System;
using System.Collections.Generic;

namespace hospitalApi.DTOs.Inputs;

public partial class TreatmentInput
{
    public int Id { get; set; }

    public int FkPatientId { get; set; }

    public string? Description { get; set; }

    public DateTime Time { get; set; }
}
