using System;
using System.Collections.Generic;

namespace hospitalApi.DTOs.Inputs;

public partial class FloorInput
{
    public string Name { get; set; } = null!;

    public int FkBuildingId { get; set; }
}
