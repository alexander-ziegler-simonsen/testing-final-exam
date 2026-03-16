using System;
using System.Collections.Generic;

namespace hospitalApi.DTOs.Output;

public partial class RoomBookingOutput
{
    public int Id { get; set; }

    public int FkRoomId { get; set; }

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }

    public int FkPatientId { get; set; }
}
