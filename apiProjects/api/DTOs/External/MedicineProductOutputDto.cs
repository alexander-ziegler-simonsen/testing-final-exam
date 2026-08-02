namespace hospitalApi.DTOs.External
{
    public class MedicineProductOutputDto
    {
        public required string Navn { get; set; }
        public required string Varenummer { get; set; }
        public required string Firma { get; set; }
        public required string Styrke { get; set; }
        public required string Detaljer { get; set; }
        public required string Pakning { get; set; }
    }
}
