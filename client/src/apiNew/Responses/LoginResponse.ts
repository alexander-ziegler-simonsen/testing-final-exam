import { z } from 'zod';

export interface LoginResponse
{
    Token : string 
    StaffId : number | null 
    PatientId : number | null 
    Firstname : string | null 
    Lastname : string | null 
    Role : string 
}
export const LoginResponseSchema = z.object({
    Token: z.string().max(255),
    StaffId: z.int32().nullable(),
    PatientId: z.int32().nullable(),
    Firstname: z.string().min(2).max(100).nullable(),
    Lastname: z.string().min(2).max(100).nullable(),
    Role: z.string(),
})