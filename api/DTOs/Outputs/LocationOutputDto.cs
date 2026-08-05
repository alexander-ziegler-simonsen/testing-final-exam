namespace hospitalApi.DTOs.Outputs
{
    public class LocationOutputDto
    {
        public required BuildingOutputDto Building { get; set; }
        public required List<FloorRoomsOutputDto> FloorsWithRooms { get; set; }
    }
}
