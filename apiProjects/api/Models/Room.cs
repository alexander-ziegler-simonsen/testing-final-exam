using System;
using System.Collections.Generic;

namespace hospitalApi.Models;

public partial class Room
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int FkFloorId { get; set; }

    public virtual Floor FkFloor { get; set; } = null!;

    public virtual ICollection<RoomBooking> RoomBookings { get; set; } = new List<RoomBooking>();
}
