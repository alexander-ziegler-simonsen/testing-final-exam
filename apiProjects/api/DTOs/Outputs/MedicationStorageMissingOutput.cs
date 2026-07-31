using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Outputs;

public partial class MedicationStorageMissingOutput
{
    public int Id { get; set; }

    public int FkMedicationStorageId { get; set; }

    public double AmountMissing { get; set; }

    public DateTime WentMissingAt { get; set; }
}
