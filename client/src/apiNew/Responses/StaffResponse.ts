import { z } from 'zod';

export interface  StaffResponse
{
    Id : number; 
    
    Firstname : string | null; 
    
    Lastname : string | null; 

    FkRoleId : number; 
}
export const StaffResponseSchema = z.object({
    
})