import { z } from 'zod';
export interface TreatmentRequest
{
    fkPatientId: number;
    description: string | null;
    time: Date;
}
export const TreatmentRequestSchema = z.object({
    fkPatientId: z.int32(),
    description: z.string().min(2).max(500).nullable(),
    time: z.date(),
})