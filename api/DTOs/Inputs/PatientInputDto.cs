using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Inputs;

public partial class PatientInputDto
{
    [StringLength(100, MinimumLength = 2)]
    [DefaultValue("michael")]
    public string? Firstname { get; set; }
    [StringLength(100, MinimumLength = 2)]
    [DefaultValue("conklin")]
    public string? Lastname { get; set; }
    [StringLength(50, MinimumLength = 2)]
    [DefaultValue("male")]
    public string? Gender { get; set; }
    [StringLength(10)]
    [DefaultValue("1505534561")]
    public string? CprNumber { get; set; }
}
