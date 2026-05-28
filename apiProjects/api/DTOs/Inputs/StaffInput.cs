using System;
using System.Collections.Generic;

namespace hospitalApi.DTOs.Inputs;

public partial class StaffInput
{
    public string? Firstname { get; set; }

    public string? Lastname { get; set; }

    public int FkRoleId { get; set; }
}
