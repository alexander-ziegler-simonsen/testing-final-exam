import { z } from 'zod';

export interface  RegisterInputRequest
{
    Username: string;
    Password: string;
    FkStaffId: number | null;
    FkPatientId: number | null;
}
export const RegisterInputRequestSchema = z.object({
    Username: z.string().min(2).max(100),
    Password: z.string().min(8).max(40),
    FkStaffId: z.int32().nullable(),
    FkPatientId: z.int32().nullable(),
})