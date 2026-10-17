import { z } from 'zod';


export interface  PatientResponse
{
    Id : number; 
    
    Firstname : string | null; 
    
    Lastname : string | null; 
    
    Gender : string | null; 
    
    CprNumber : string | null; 
    DateOfBirth : Date | null; 
    WeightKg : number | null; 
    HeightCm : number | null; 
}
export const PatientResponseSchema = z.object({
    Id: z.int32(),
    Firstname: z.string().min(2).max(100).nullable(),
    Lastname: z.string().min(2).max(100).nullable(),
    Gender: z.string().min(2).max(50).nullable(),
    CprNumber: z.string().max(10).nullable(),
    DateOfBirth: z.iso.date().transform((s) => new Date(s)).nullable(),
    WeightKg: z.number().nullable(),
    HeightCm: z.number().nullable(),
})