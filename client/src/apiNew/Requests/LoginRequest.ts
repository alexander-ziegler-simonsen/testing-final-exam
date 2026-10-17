import { z } from 'zod';

export interface LoginRequest
{
    Username: string;
    Password: string;
}
export const LoginRequestSchema = z.object({

})
