import { z } from 'zod';


export interface MedicationRequest
{
    Name: string | null;
    GenericName: string | null;
    Brand: string | null;
    Form: string | null;
    Strength: string | null;
    Category: string | null;
    Description: string | null;
}
export const MedicationRequestSchema = z.object({

})