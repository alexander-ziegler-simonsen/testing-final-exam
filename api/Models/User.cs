using System;
using System.Collections.Generic;

namespace hospitalApi.Models;

public partial class User
{
    public int Id { get; set; }

    public string Username { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string Salt { get; set; } = null!;

    public int? FkStaffId { get; set; }

    public virtual Staff? FkStaff { get; set; }

    public virtual UserPatient? UserPatient { get; set; }
}
