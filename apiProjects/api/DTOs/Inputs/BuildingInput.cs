using System;
using System.Collections.Generic;

namespace hospitalApi.DTOs.Inputs;

public partial class BuildingInput
{
    public string Name { get; set; } = null!;

    public string? Address { get; set; }
}
