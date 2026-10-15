using System;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Inputs;

public partial class RegisterBabyDto
{
    [StringLength(100, MinimumLength = 2)]
    public string? Firstname { get; set; }
    [StringLength(100, MinimumLength = 2)]
    public string? Lastname { get; set; }

    [Range(0, 20, ErrorMessage = "Weight must be between 0 and 20 kg.")]
    public float WeightKg { get; set; }
    [Range(0, 80, ErrorMessage = "Height must be between 0 and 80 cm.")]
    public float HeightCm { get; set; }

    public string? Gender { get; set; }
    public DateOnly DateOfBirth { get; set; }
}
