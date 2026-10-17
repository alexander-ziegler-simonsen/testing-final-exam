import { z } from 'zod';

export interface LoginResponse
{
    token : string 
    staffId : number | null 
    patientId : number | null 
    firstname : string | null 
    lastname : string | null 
    role : string 
}
export const LoginResponseSchema = z.object({
    token: z.string(),
    staffId: z.int32().nullable(),
    patientId: z.int32().nullable(),
    firstname: z.string().min(2).max(100).nullable(),
    lastname: z.string().min(2).max(100).nullable(),
    role: z.string(),
})