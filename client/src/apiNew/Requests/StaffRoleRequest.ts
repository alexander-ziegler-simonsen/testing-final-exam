import { z } from 'zod';


export interface StaffRoleRequest
{
    name: string;
}
export const StaffRoleRequestSchema = z.object({
    name: z.string().min(2).max(50),
})