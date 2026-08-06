using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Outputs;

public partial class RoomOutputDto
{
    [DefaultValue(1)]
    public int Id { get; set; }

    [DefaultValue("room a101")]
    public string Name { get; set; } = null!;

    [DefaultValue(1)]
    public int FkFloorId { get; set; }
}
