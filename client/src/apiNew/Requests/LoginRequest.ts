import { z } from 'zod';

export interface LoginRequest
{
    Username: string;
    Password: string;
}
export const LoginRequestSchema = z.object({
    Username: z.string().min(2).max(100),
    Password: z.string().min(8).max(40),
})
