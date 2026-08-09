using System;
using System.Collections.Generic;

namespace hospitalApi.Models;

public partial class Staff
{
    public int Id { get; set; }

    public string? Firstname { get; set; }

    public string? Lastname { get; set; }

    public int FkRoleId { get; set; }

    public virtual ICollection<DepartmentStaff> DepartmentStaffs { get; set; } = new List<DepartmentStaff>();

    public virtual StaffRole FkRole { get; set; } = null!;

    public virtual ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();

    public virtual ICollection<TreatmentStaff> TreatmentStaffs { get; set; } = new List<TreatmentStaff>();
}
