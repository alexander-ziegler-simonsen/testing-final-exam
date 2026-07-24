export interface MedicineDetail {
    navn?: string;
    varenummer?: string;
    styrke?: string;
    pakning?: string;
    virksomtStof?: string;
    firma?: string;
    atcKode?: string;
    dosisdispensering: boolean;
    udleveringsgruppe?: string;
    prisPrPakning?: string;
    prisPrEnhed?: string;
    aip?: string;
    tilskudBeregnesAf?: string;
    Udgaaet: boolean;
    UdgaaetDato?: string;
    dosering?: string;
    indikation?: string;
    trafikAdvarsel: boolean;
    ddd?: string;
    opbevaringsbetingelser?: string;
    nbsSpeciale?: string;
    Haandkoeb: boolean;
    tilskudKode?: string;
    tilskudTekst?: string;
}
