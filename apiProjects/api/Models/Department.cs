using System;
using System.Collections.Generic;

namespace hospitalApi.Models;

public partial class Department
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? Type { get; set; }

    public virtual ICollection<DepartmentStaff> DepartmentStaffs { get; set; } = new List<DepartmentStaff>();
}
