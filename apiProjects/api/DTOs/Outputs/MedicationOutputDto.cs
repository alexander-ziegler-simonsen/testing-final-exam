using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Outputs;

public partial class MedicationOutputDto
{
    [DefaultValue(1)]
    public int Id { get; set; }
    [StringLength(100, MinimumLength = 2)]
    [DefaultValue("paracetamol")]
    public string? Name { get; set; }
    [StringLength(100, MinimumLength = 2)]
    [DefaultValue("acetaminophen")]
    public string? GenericName { get; set; }
    [StringLength(100, MinimumLength = 2)]
    [DefaultValue("panodil")]
    public string? Brand { get; set; }
    [StringLength(100, MinimumLength = 2)]
    [DefaultValue("tablet")]
    public string? Form { get; set; }
    [StringLength(100, MinimumLength = 2)]
    [DefaultValue("500mg")]
    public string? Strength { get; set; }
    [StringLength(100, MinimumLength = 2)]
    [DefaultValue("pain relief")]
    public string? Category { get; set; }

    [DefaultValue("used to treat mild to moderate pain and fever.")]
    public string? Description { get; set; }
}
