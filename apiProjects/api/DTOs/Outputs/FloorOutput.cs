using System;
using System.Collections.Generic;

namespace hospitalApi.DTOs.Output;

public partial class FloorOutput
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int FkBuildingId { get; set; }
}
