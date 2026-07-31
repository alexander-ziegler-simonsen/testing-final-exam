using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Outputs;

public partial class MedicationStorageOutput
{
    public int Id { get; set; }

    public int FkMedicationId { get; set; }

    public double Amount { get; set; }
}
