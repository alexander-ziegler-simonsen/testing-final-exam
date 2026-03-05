using System;
using System.Collections.Generic;

namespace hospitalApi.Models;

public partial class DepartmentStaff
{
    public int Id { get; set; }

    public int FkStaffId { get; set; }

    public int FkDepartmentId { get; set; }

    public virtual Department FkDepartment { get; set; } = null!;

    public virtual Staff FkStaff { get; set; } = null!;
}
