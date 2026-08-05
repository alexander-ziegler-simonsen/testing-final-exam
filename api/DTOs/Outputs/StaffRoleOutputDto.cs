using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Outputs;

public partial class StaffRoleOutputDto
{
    [DefaultValue(1)]
    public int Id { get; set; }
    [StringLength(50, MinimumLength = 2)]
    [DefaultValue("doctor")]
    public string Name { get; set; } = null!;
}
