import { z } from 'zod';

export interface  UserResponse
{
    Id : number ;
    Username : string;
    FkStaffId : number | null; 
    FkPatientId : number | null; 
}
export const UserResponseSchema = z.object({
    Id: z.int32(),
    Username: z.string().min(2).max(100),
    FkStaffId: z.int32().nullable(),
    FkPatientId: z.int32().nullable(),
})
