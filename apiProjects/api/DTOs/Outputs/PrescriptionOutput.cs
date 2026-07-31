using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Outputs;

public partial class PrescriptionOutput
{
    public int Id { get; set; }

    public int FkMedicationId { get; set; }

    public int FkTreatmentId { get; set; }

    public int FkPrescribedByStaffId { get; set; }

    public double Doses { get; set; }
}
