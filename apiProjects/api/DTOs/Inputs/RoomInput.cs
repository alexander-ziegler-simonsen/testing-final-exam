using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Inputs;

public partial class RoomInput
{
    public string Name { get; set; } = null!;

    public int FkFloorId { get; set; }
}
