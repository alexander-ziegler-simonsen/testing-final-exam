using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Inputs;

public partial class FloorInputDto
{
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = null!;

    public int FkBuildingId { get; set; }
}
