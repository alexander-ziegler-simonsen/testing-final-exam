using System;
using System.Collections.Generic;

namespace hospitalApi.Models;

public partial class RoomBooking
{
    public int Id { get; set; }

    public int FkRoomId { get; set; }

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }

    public int FkPatientId { get; set; }

    public virtual Patient FkPatient { get; set; } = null!;

    public virtual Room FkRoom { get; set; } = null!;
}
