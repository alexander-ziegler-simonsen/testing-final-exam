using System;
using System.Collections.Generic;

namespace hospitalApi.DTOs.Inputs;

public partial class PrescriptionInput
{
    public int FkMedicationId { get; set; }

    public int FkTreatmentId { get; set; }

    public int FkPrescribedByStaffId { get; set; }

    public double Doses { get; set; }
}
