using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Outputs;

public partial class StaffOutputDto
{
    [DefaultValue(1)]
    public int Id { get; set; }
    [StringLength(100, MinimumLength = 2)]
    [DefaultValue("lars")]
    public string? Firstname { get; set; }
    [StringLength(100, MinimumLength = 2)]
    [DefaultValue("christensen")]
    public string? Lastname { get; set; }

    [DefaultValue(1)]
    public int FkRoleId { get; set; }
}
