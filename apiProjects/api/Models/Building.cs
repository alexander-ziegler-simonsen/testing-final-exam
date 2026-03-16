using System;
using System.Collections.Generic;

namespace hospitalApi.Models;

public partial class Building
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Address { get; set; }

    public virtual ICollection<Floor> Floors { get; set; } = new List<Floor>();
}
