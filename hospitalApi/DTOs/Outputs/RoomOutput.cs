using System;
using System.Collections.Generic;

namespace hospitalApi.DTOs.Output;

public partial class RoomOutput
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int FkFloorId { get; set; }
}
