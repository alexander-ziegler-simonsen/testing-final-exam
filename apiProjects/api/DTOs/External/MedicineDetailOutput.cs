namespace hospitalApi.DTOs.External
{
    public class MedicineDetailOutput
    {
        public string? Navn { get; set; }
        public string? Varenummer { get; set; }
        public string? Styrke { get; set; }
        public string? Pakning { get; set; }
        public string? VirksomtStof { get; set; }
        public string? Firma { get; set; }
        public string? AtcKode { get; set; }
        public bool Dosisdispensering { get; set; }
        public string? Udleveringsgruppe { get; set; }
        public string? PrisPrPakning { get; set; }
        public string? PrisPrEnhed { get; set; }
        public string? AIP { get; set; }
        public string? TilskudBeregnesAf { get; set; }
        public bool Udgaaet { get; set; }
        public string? UdgaaetDato { get; set; }
        // public string? Substitutioner {get; set;}  [],
        // public string? BilligereKombinationer {get; set;}  [],
        public string? Dosering { get; set; }
        public string? Indikation { get; set; }
        public bool TrafikAdvarsel { get; set; }
        public string? DDD { get; set; }
        public string? Opbevaringsbetingelser { get; set; }
        public string? NbsSpeciale { get; set; }
        public bool Haandkoeb { get; set; }
        public string? TilskudKode { get; set; }
        public string? TilskudTekst { get; set; }
    }
}
