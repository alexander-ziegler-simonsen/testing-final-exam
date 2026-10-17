import { z } from 'zod';


export interface  StaffRoleResponse
{
    Id : number; 
    Name : string; 
}

export const StaffRoleResponseSchema = z.object({
    Id: z.int32(),
    Name: z.string().min(2).max(50),
})