import { z } from 'zod';

export interface TreatmentStaffResponse
{
    Id : number; 

    FkTreatmentId : number; 

    FkStaffId : number; 

}
export const TreatmentStaffResponseSchema = z.object({
    Id: z.int32(),
    FkTreatmentId: z.int32(),
    FkStaffId: z.int32(),
})