using System.ComponentModel;

namespace hospitalApi.DTOs.External
{
    public class MedicineProductOutputDto
    {
        [DefaultValue("Panodil")]
        public required string Navn { get; set; }
        [DefaultValue("058626")]
        public required string Varenummer { get; set; }
        [DefaultValue("GSK")]
        public required string Firma { get; set; }
        [DefaultValue("500 mg")]
        public required string Styrke { get; set; }
        [DefaultValue("Håndkøbsmedicin mod smerter og feber")]
        public required string Detaljer { get; set; }
        [DefaultValue("20 stk.")]
        public required string Pakning { get; set; }
    }
}
