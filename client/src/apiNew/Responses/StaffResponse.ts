import { z } from 'zod';

export interface  StaffResponse
{
    Id : number; 
    
    Firstname : string | null; 
    
    Lastname : string | null; 

    FkRoleId : number; 
}
export const StaffResponseSchema = z.object({
    Id: z.int32(),
    Firstname: z.string().min(2).max(100).nullable(),
    Lastname: z.string().min(2).max(100).nullable(),
    FkRoleId: z.int32(),
})