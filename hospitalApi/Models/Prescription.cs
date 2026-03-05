using System;
using System.Collections.Generic;

namespace hospitalApi.Models;

public partial class Prescription
{
    public int Id { get; set; }

    public int FkMedicationId { get; set; }

    public int FkTreatmentId { get; set; }

    public int FkPrescribedByStaffId { get; set; }

    public double Doses { get; set; }

    public virtual Medication FkMedication { get; set; } = null!;

    public virtual Staff FkPrescribedByStaff { get; set; } = null!;

    public virtual Treatment FkTreatment { get; set; } = null!;
}
