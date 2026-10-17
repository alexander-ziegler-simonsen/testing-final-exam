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
    
})