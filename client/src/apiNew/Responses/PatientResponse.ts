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
    
})