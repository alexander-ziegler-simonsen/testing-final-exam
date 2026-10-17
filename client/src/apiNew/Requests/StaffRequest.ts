import { z } from 'zod';


export interface StaffRequest
{
    Firstname: string;
    Lastname: string;
    FkRoleId: number;
}
export const StaffRequestSchema = z.object({
    Firstname: z.string().min(2).max(100),
    Lastname: z.string().min(2).max(100),
    FkRoleId: z.int32(),
})