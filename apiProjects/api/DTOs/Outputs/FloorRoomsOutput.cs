namespace hospitalApi.DTOs.Outputs
{
    public class FloorRoomsOutput
    {
        public required FloorOutput Floor { get; set; }
        public required List<RoomOutput> Rooms { get; set; }

    }
}
