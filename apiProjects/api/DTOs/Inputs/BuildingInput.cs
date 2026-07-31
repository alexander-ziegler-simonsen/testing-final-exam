using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Inputs;

public partial class BuildingInput
{
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = null!;
    [StringLength(255, MinimumLength = 2)]
    public string? Address { get; set; }
}
