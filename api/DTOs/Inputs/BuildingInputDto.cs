using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Inputs;

public partial class BuildingInputDto
{
    [StringLength(100, MinimumLength = 2)]
    [DefaultValue("main hospital")]
    public string Name { get; set; } = null!;
    [StringLength(255, MinimumLength = 2)]
    [DefaultValue("123 health st")]
    public string? Address { get; set; }
}
