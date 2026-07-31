using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Outputs;

public partial class RoomOutput
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int FkFloorId { get; set; }
}
