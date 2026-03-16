using System;
using System.Collections.Generic;

namespace hospitalApi.DTOs.Output;

public partial class DepartmentOutput
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? Type { get; set; }
}
