import { z } from 'zod';

export interface TreatmentStaffResponse
{
    Id : number; 

    FkTreatmentId : number; 

    FkStaffId : number; 

}
export const TreatmentStaffResponseSchema = z.object({
    
})