using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Inputs;

public partial class StaffRoleInput
{
    [StringLength(50, MinimumLength = 2)]
    public string Name { get; set; } = null!;
}
