using System;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Inputs;

public partial class RegisterBabyDto
{
    [StringLength(100, MinimumLength = 2)]
    public string? Firstname { get; set; }
    [StringLength(100, MinimumLength = 2)]
    public string? Lastname { get; set; }
    [StringLength(50, MinimumLength = 2)]
    public string? Gender { get; set; }
    public DateOnly DateOfBirth { get; set; }
}
