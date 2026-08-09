using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Inputs;

public partial class PrescriptionInputDto
{
    public int FkMedicationId { get; set; }

    public int FkTreatmentId { get; set; }

    public int FkPrescribedByStaffId { get; set; }

    public double Doses { get; set; }
}
