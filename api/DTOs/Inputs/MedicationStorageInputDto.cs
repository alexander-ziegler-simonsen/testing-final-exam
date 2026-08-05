using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Inputs;

public partial class MedicationStorageInputDto
{
    [DefaultValue(1)]
    public int FkMedicationId { get; set; }

    [DefaultValue(500.0)]
    public double Amount { get; set; }
}
