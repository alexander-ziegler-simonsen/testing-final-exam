import { z } from 'zod';

export interface MedicineDetailResponse
    {
        Navn : string | null; 
        Varenummer : string | null; 
        Styrke : string | null; 
        Pakning : string | null; 
        VirksomtStof : string | null; 
        Firma : string | null; 
        AtcKode : string | null; 
        Dosisdispensering : boolean; 
        Udleveringsgruppe : string | null; 
        PrisPrPakning : string | null; 
        PrisPrEnhed : string | null; 
        AIP : string | null; 
        TilskudBeregnesAf : string | null; 
        Udgaaet : boolean; 
        UdgaaetDato : string | null; 
        Dosering : string | null; 
        Indikation : string | null; 
        TrafikAdvarsel : boolean; 
        DDD : string | null; 
        Opbevaringsbetingelser : string | null; 
        NbsSpeciale : string | null; 
        Haandkoeb : boolean; 
        TilskudKode : string | null; 
        TilskudTekst : string | null; 
    }
export const MedicineDetailResponseSchema = z.object({
    Navn: z.string().nullable(),
    Varenummer: z.string().nullable(),
    Styrke: z.string().nullable(),
    Pakning: z.string().nullable(),
    VirksomtStof: z.string().nullable(),
    Firma: z.string().nullable(),
    AtcKode: z.string().nullable(),
    Dosisdispensering: z.boolean(),
    Udleveringsgruppe: z.string().nullable(),
    PrisPrPakning: z.string().nullable(),
    PrisPrEnhed: z.string().nullable(),
    AIP: z.string().nullable(),
    TilskudBeregnesAf: z.string().nullable(),
    Udgaaet: z.boolean(),
    UdgaaetDato: z.string().nullable(),
    Dosering: z.string().nullable(),
    Indikation: z.string().nullable(),
    TrafikAdvarsel: z.boolean(),
    DDD: z.string().nullable(),
    Opbevaringsbetingelser: z.string().nullable(),
    NbsSpeciale: z.string().nullable(),
    Haandkoeb: z.boolean(),
    TilskudKode: z.string().nullable(),
    TilskudTekst: z.string().nullable(),
})