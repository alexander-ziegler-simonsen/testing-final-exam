using System;
using System.Collections.Generic;

namespace hospitalApi.DTOs.Outputs;

public partial class FloorOutput
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int FkBuildingId { get; set; }
}
