using System;
using System.Collections.Generic;

namespace hospitalApi.DTOs.Output;

public partial class MedicationStorageOutput
{
    public int Id { get; set; }

    public int FkMedicationId { get; set; }

    public double Amount { get; set; }
}
