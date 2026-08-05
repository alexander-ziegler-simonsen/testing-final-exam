using System;
using System.Collections.Generic;

namespace hospitalApi.Models;

public partial class UserPatient
{
    public int Id { get; set; }

    public int FkUserId { get; set; }

    public int FkPatientId { get; set; }

    public virtual User FkUser { get; set; } = null!;

    public virtual Patient FkPatient { get; set; } = null!;
}
