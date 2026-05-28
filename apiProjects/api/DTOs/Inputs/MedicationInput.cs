using System;
using System.Collections.Generic;

namespace hospitalApi.DTOs.Inputs;

public partial class MedicationInput
{
    public string? Name { get; set; }

    public string? GenericName { get; set; }

    public string? Brand { get; set; }

    public string? Form { get; set; }

    public string? Strength { get; set; }

    public string? Category { get; set; }

    public string? Description { get; set; }
}
