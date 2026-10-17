import { z } from 'zod';

export interface TreatmentStaffRequest
{
    FkTreatmentId: number;
    FkStaffId: number;
}

export const TreatmentStaffRequestSchema = z.object({
    
})