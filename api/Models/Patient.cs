using System;
using System.Collections.Generic;

namespace hospitalApi.Models;

public partial class Patient
{
    public int Id { get; set; }

    public string? Firstname { get; set; }

    public string? Lastname { get; set; }

    public string? Gender { get; set; }

    public string? CprNumber { get; set; }

    public virtual ICollection<RoomBooking> RoomBookings { get; set; } = new List<RoomBooking>();

    public virtual ICollection<Treatment> Treatments { get; set; } = new List<Treatment>();

    public virtual UserPatient? UserPatient { get; set; }
}
