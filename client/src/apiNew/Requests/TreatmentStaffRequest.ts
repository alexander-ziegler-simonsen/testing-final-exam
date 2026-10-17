import { z } from 'zod';

export interface TreatmentStaffRequest
{
    fkTreatmentId: number;
    fkStaffId: number;
}

export const TreatmentStaffRequestSchema = z.object({
    fkTreatmentId: z.int32(),
    fkStaffId: z.int32(),
})