using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Inputs;

public partial class PatientInput
{
    [StringLength(100, MinimumLength = 2)]
    public string? Firstname { get; set; }
    [StringLength(100, MinimumLength = 2)]
    public string? Lastname { get; set; }
    [StringLength(50, MinimumLength = 2)]
    public string? Gender { get; set; }
    [StringLength(10)]
    public string? CprNumber { get; set; }
}
