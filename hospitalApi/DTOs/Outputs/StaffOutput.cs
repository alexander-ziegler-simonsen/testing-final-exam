using System;
using System.Collections.Generic;

namespace hospitalApi.DTOs.Output;

public partial class StaffOutput
{
    public int Id { get; set; }

    public string? Firstname { get; set; }

    public string? Lastname { get; set; }

    public int FkRoleId { get; set; }
}
