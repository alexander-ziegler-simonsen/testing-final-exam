import { z } from 'zod';


export interface StaffRequest
{
    Firstname: string;
    Lastname: string;
    FkRoleId: number;
}
export const StaffRequestSchema = z.object({
    
})