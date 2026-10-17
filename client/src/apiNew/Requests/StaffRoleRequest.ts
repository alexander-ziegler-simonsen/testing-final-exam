import { z } from 'zod';


export interface StaffRoleRequest
{
    Name: string;
}
export const StaffRoleRequestSchema = z.object({
    Name: z.string().min(2).max(50),
})