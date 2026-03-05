using System;
using System.Collections.Generic;

namespace hospitalApi.DTOs.Inputs;

public partial class MedicationStorageInput
{
    public int Id { get; set; }

    public int FkMedicationId { get; set; }

    public double Amount { get; set; }
}
