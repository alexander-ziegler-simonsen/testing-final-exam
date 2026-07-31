using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Inputs;

public partial class StaffInput
{
    [StringLength(100, MinimumLength = 2)]
    public string? Firstname { get; set; }
    [StringLength(100, MinimumLength = 2)]
    public string? Lastname { get; set; }

    public int FkRoleId { get; set; }
}
