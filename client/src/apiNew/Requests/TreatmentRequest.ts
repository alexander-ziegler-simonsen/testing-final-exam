import { z } from 'zod';
export interface TreatmentRequest
{
    FkPatientId: number;
    Description: string;
    Time: Date;
}
export const TreatmentRequestSchema = z.object({
    
})