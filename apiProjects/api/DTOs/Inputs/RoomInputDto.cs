using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Inputs;

public partial class RoomInputDto
{
    [DefaultValue("room a101")]
    public string Name { get; set; } = null!;

    [DefaultValue(1)]
    public int FkFloorId { get; set; }
}
