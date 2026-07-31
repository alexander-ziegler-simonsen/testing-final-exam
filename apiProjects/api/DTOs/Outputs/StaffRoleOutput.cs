using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Outputs;

public partial class StaffRoleOutput
{
    public int Id { get; set; }
    [StringLength(50, MinimumLength = 2)]
    public string Name { get; set; } = null!;
}
