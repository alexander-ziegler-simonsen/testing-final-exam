import { z } from 'zod';

export interface  RegisterUserRequest
{
    username: string;
    password: string;
    fkStaffId: number | null;
    fkPatientId: number | null;
}
export const RegisterUserRequestSchema = z.object({
    username: z.string().min(2).max(100),
    password: z.string().min(8).max(40),
    fkStaffId: z.int32().nullable(),
    fkPatientId: z.int32().nullable(),
})