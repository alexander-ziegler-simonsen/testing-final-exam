import { z } from 'zod';

export interface TreatmentResponse
{
    Id :  number; 

    FkPatientId :  number; 
   
    Description :  string | null;

    Time :  Date; 
}

export const TreatmentResponseSchema = z.object({
    
})