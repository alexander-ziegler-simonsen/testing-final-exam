import { z } from 'zod';

export interface LoginRequest
{
    username: string;
    password: string;
}
export const LoginRequestSchema = z.object({
    username: z.string().min(2).max(100),
    password: z.string().min(8).max(40),
})
