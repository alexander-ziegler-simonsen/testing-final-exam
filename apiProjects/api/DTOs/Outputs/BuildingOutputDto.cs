using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Outputs;

public partial class BuildingOutputDto
{
    public int Id { get; set; }
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = null!;
    [StringLength(255, MinimumLength = 2)]
    public string? Address { get; set; }
}
