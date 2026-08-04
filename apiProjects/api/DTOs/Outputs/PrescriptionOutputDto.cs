using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Outputs;

public partial class PrescriptionOutputDto
{
    [DefaultValue(1)]
    public int Id { get; set; }

    [DefaultValue(1)]
    public int FkMedicationId { get; set; }

    [DefaultValue(1)]
    public int FkTreatmentId { get; set; }

    [DefaultValue(1)]
    public int FkPrescribedByStaffId { get; set; }

    [DefaultValue(2)]
    public double Doses { get; set; }
}
