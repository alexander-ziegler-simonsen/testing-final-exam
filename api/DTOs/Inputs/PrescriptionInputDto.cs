using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Inputs;

public partial class PrescriptionInputDto
{
    [DefaultValue(1)]
    public int FkMedicationId { get; set; }

    [DefaultValue(1)]
    public int FkTreatmentId { get; set; }

    [DefaultValue(1)]
    public int FkPrescribedByStaffId { get; set; }

    [DefaultValue(2.0)]
    public double Doses { get; set; }
}
