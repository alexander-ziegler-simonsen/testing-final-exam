using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Inputs;

public partial class FloorInputDto
{
    [StringLength(100, MinimumLength = 2)]
    [DefaultValue("ground floor")]
    public string Name { get; set; } = null!;

    [DefaultValue(1)]
    public int FkBuildingId { get; set; }
}
