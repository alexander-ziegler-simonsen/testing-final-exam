using System;
using System.Collections.Generic;

namespace hospitalApi.DTOs.Output;

public partial class MedicationStorageMissingOutput
{
    public int Id { get; set; }

    public int FkMedicationStorageId { get; set; }

    public double AmountMissing { get; set; }

    public DateTime WentMissingAt { get; set; }
}
