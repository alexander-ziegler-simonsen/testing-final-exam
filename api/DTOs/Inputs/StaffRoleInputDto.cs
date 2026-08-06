using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Inputs;

public partial class StaffRoleInputDto
{
    [StringLength(50, MinimumLength = 2)]
    [DefaultValue("doctor")]
    public string Name { get; set; } = null!;
}
