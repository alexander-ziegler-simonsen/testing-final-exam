using System;
using System.Collections.Generic;

namespace hospitalApi.DTOs.Inputs;

public partial class DepartmentInput
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? Type { get; set; }
}
