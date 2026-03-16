using System;
using System.Collections.Generic;

namespace hospitalApi.DTOs.Output;

public partial class PatientOutput
{
    public int Id { get; set; }

    public string? Firstname { get; set; }

    public string? Lastname { get; set; }

    public string? Gender { get; set; }

    public string? CprNumber { get; set; }
}
