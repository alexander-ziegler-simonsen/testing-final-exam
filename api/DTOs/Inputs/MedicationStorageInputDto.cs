using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Inputs;

public partial class MedicationStorageInputDto
{
    public int FkMedicationId { get; set; }

    public double Amount { get; set; }
}
