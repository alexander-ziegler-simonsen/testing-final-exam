using System;
using System.Collections.Generic;

namespace hospitalApi.Models;

public partial class MedicationStorageMissing
{
    public int Id { get; set; }

    public int FkMedicationStorageId { get; set; }

    public double AmountMissing { get; set; }

    public DateTime WentMissingAt { get; set; }

    public virtual MedicationStorage FkMedicationStorage { get; set; } = null!;
}
