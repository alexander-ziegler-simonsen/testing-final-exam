using System.ComponentModel;

namespace hospitalApi.DTOs.External
{
    public class MedicineDetailOutputDto
    {
        [DefaultValue("Panodil 500 mg tabletter")]
        public string? Navn { get; set; }
        [DefaultValue("058626")]
        public string? Varenummer { get; set; }
        [DefaultValue("500 mg")]
        public string? Styrke { get; set; }
        [DefaultValue("20 stk.")]
        public string? Pakning { get; set; }
        [DefaultValue("Paracetamol")]
        public string? VirksomtStof { get; set; }
        [DefaultValue("GSK")]
        public string? Firma { get; set; }
        [DefaultValue("N02BE01")]
        public string? AtcKode { get; set; }
        [DefaultValue(false)]
        public bool Dosisdispensering { get; set; }
        [DefaultValue("HF")]
        public string? Udleveringsgruppe { get; set; }
        [DefaultValue("29,95")]
        public string? PrisPrPakning { get; set; }
        [DefaultValue("1,50")]
        public string? PrisPrEnhed { get; set; }
        [DefaultValue("18,50")]
        public string? AIP { get; set; }
        [DefaultValue("Pakning")]
        public string? TilskudBeregnesAf { get; set; }
        [DefaultValue(false)]
        public bool Udgaaet { get; set; }
        public string? UdgaaetDato { get; set; }
        // public string? Substitutioner {get; set;}  [],
        // public string? BilligereKombinationer {get; set;}  [],
        [DefaultValue("1-2 tabletter ved behov, maks 6 i døgnet")]
        public string? Dosering { get; set; }
        [DefaultValue("Lette til moderate smerter og feber")]
        public string? Indikation { get; set; }
        [DefaultValue(false)]
        public bool TrafikAdvarsel { get; set; }
        [DefaultValue("3 g")]
        public string? DDD { get; set; }
        [DefaultValue("Opbevares ved stuetemperatur")]
        public string? Opbevaringsbetingelser { get; set; }
        public string? NbsSpeciale { get; set; }
        [DefaultValue(true)]
        public bool Haandkoeb { get; set; }
        public string? TilskudKode { get; set; }
        public string? TilskudTekst { get; set; }
    }
}
