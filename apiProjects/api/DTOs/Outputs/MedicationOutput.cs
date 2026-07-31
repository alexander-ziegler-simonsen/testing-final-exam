using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Outputs;

public partial class MedicationOutput
{
    public int Id { get; set; }
    [StringLength(100, MinimumLength = 2)]
    public string? Name { get; set; }
    [StringLength(100, MinimumLength = 2)]
    public string? GenericName { get; set; }
    [StringLength(100, MinimumLength = 2)]
    public string? Brand { get; set; }
    [StringLength(100, MinimumLength = 2)]
    public string? Form { get; set; }
    [StringLength(100, MinimumLength = 2)]
    public string? Strength { get; set; }
    [StringLength(100, MinimumLength = 2)]
    public string? Category { get; set; }

    public string? Description { get; set; }
}
