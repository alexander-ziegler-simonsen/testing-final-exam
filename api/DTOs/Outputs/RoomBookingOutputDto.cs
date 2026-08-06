using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Outputs;

public partial class RoomBookingOutputDto
{
    [DefaultValue(1)]
    public int Id { get; set; }

    [DefaultValue(1)]
    public int FkRoomId { get; set; }

    [DefaultValue(typeof(DateTime), "2025-10-07T08:00:00")]
    public DateTime StartTime { get; set; }

    [DefaultValue(typeof(DateTime), "2025-10-07T12:00:00")]
    public DateTime EndTime { get; set; }

    [DefaultValue(1)]
    public int FkPatientId { get; set; }
}
