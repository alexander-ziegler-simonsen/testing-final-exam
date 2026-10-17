import { z } from 'zod';

export interface TreatmentResponse
{
    Id :  number; 

    FkPatientId :  number; 
   
    Description :  string | null;

    Time :  Date; 
}

export const TreatmentResponseSchema = z.object({
    Id: z.int32(),
    FkPatientId: z.int32(),
    Description: z.string().min(2).max(500).nullable(),
    Time: z.iso.datetime({ offset: true, local: true }).transform((s) => new Date(s)),
})