import { z } from 'zod';

export interface  MedicineProductResponse
    {
        Navn : string; 
        Varenummer : string; 
        Firma : string; 
        Styrke : string; 
        Detaljer : string; 
        Pakning : string; 
    }
export const MedicineProductResponseSchema = z.object({
    Navn: z.string(),
    Varenummer: z.string(),
    Firma: z.string(),
    Styrke: z.string(),
    Detaljer: z.string(),
    Pakning: z.string(),
})