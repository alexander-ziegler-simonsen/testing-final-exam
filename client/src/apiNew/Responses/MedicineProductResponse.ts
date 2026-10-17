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
    
})