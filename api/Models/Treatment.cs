using System;
using System.Collections.Generic;

namespace hospitalApi.Models;

public partial class Treatment
{
    public int Id { get; set; }

    public int FkPatientId { get; set; }

    public string? Description { get; set; }

    public DateTime Time { get; set; }

    public virtual Patient FkPatient { get; set; } = null!;

    public virtual ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();

    public virtual ICollection<TreatmentStaff> TreatmentStaffs { get; set; } = new List<TreatmentStaff>();
}
