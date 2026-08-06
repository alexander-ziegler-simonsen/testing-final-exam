using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Outputs;

public partial class MedicationStorageMissingOutputDto
{
    [DefaultValue(1)]
    public int Id { get; set; }

    [DefaultValue(1)]
    public int FkMedicationStorageId { get; set; }

    [DefaultValue(10.0)]
    public double AmountMissing { get; set; }

    [DefaultValue(typeof(DateTime), "2025-10-07T12:00:00")]
    public DateTime WentMissingAt { get; set; }
}
