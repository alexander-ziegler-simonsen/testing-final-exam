import { z } from 'zod';
export interface TreatmentRequest
{
    FkPatientId: number;
    Description: string;
    Time: Date;
}
export const TreatmentRequestSchema = z.object({
    FkPatientId: z.int32(),
    Description: z.string().min(2).max(500),
    Time: z.date(),
})