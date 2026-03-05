using System;
using System.Collections.Generic;

namespace hospitalApi.Models;

public partial class MedicationStorage
{
    public int Id { get; set; }

    public int FkMedicationId { get; set; }

    public double Amount { get; set; }

    public virtual Medication FkMedication { get; set; } = null!;

    public virtual ICollection<MedicationStorageMissing> MedicationStorageMissings { get; set; } = new List<MedicationStorageMissing>();
}
