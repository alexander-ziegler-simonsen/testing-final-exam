import { z } from 'zod';


export interface StaffRequest
{
    firstname: string;
    lastname: string;
    fkRoleId: number;
}
export const StaffRequestSchema = z.object({
    firstname: z.string().min(2).max(100),
    lastname: z.string().min(2).max(100),
    fkRoleId: z.int32(),
})