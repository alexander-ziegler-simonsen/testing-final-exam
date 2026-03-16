using System;
using System.Collections.Generic;

namespace hospitalApi.DTOs.Inputs;

public partial class RoomInput
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int FkFloorId { get; set; }
}
