using System;
using System.Collections.Generic;

namespace hospitalApi.DTOs.Output;

public partial class BuildingOutput
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Address { get; set; }
}
