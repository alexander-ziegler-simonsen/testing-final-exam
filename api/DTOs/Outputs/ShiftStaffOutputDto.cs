using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace hospitalApi.DTOs.Outputs;

public partial class ShiftStaffOutputDto
{
    public int Id { get; set; }

    public int FkShiftId { get; set; }

    public int FkStaffId { get; set; }
}
