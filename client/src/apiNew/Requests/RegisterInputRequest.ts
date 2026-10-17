import { z } from 'zod';

export interface  RegisterInputRequest
{
    Username: string;
    Password: string;
    FkStaffId: number | null;
    FkPatientId: number | null;
}
export const RegisterInputRequestSchema = z.object({
    
})