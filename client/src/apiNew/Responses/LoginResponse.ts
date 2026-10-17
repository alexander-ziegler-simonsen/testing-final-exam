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
    
})