using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Inputs;

public partial class PatientInputDto
{
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string Firstname { get; set; } = null!;
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string Lastname { get; set; } = null!;
    [Required]
    [StringLength(50, MinimumLength = 2)]
    public string Gender { get; set; } = null!;
    [Required]
    [StringLength(10)]
    public string CprNumber { get; set; } = null!;
    // nullable so a missing date fails [Required] instead of silently becoming 0001-01-01
    [Required]
    public DateOnly? DateOfBirth { get; set; }
    public double? WeightKg { get; set; }
    public double? HeightCm { get; set; }
}
