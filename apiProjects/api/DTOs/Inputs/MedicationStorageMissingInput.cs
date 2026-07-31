using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Inputs;

public partial class MedicationStorageMissingInput
{
    public int FkMedicationStorageId { get; set; }

    public double AmountMissing { get; set; }

    public DateTime WentMissingAt { get; set; }
}
