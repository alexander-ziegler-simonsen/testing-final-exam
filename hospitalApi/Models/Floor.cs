using System;
using System.Collections.Generic;

namespace hospitalApi.Models;

public partial class Floor
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int FkBuildingId { get; set; }

    public virtual Building FkBuilding { get; set; } = null!;

    public virtual ICollection<Room> Rooms { get; set; } = new List<Room>();
}
