namespace hospitalApi.DTOs.Outputs
{
    public class FloorRoomsOutputDto
    {
        public required FloorOutputDto Floor { get; set; }
        public required List<RoomOutputDto> Rooms { get; set; }

    }
}
