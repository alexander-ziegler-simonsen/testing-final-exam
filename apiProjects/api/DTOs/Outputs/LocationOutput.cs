namespace hospitalApi.DTOs.Outputs
{
    public class LocationOutput
    {
        public required BuildingOutput Building { get; set; }
        public required List<FloorRoomsOutput> FloorsWithRoomns { get; set; }
    }
}
