using System;
using System.Collections.Generic;

namespace hospitalApi.DTOs.Inputs;

public partial class PatientInput
{
    public string? Firstname { get; set; }

    public string? Lastname { get; set; }

    public string? Gender { get; set; }

    public string? CprNumber { get; set; }
}
