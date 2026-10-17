import { z } from 'zod';


export interface MedicationRequest
{
    name: string | null;
    genericName: string | null;
    brand: string | null;
    form: string | null;
    strength: string | null;
    category: string | null;
    description: string | null;
}
export const MedicationRequestSchema = z.object({
    name: z.string().min(2).max(100).nullable(),
    genericName: z.string().min(2).max(100).nullable(),
    brand: z.string().min(2).max(100).nullable(),
    form: z.string().min(2).max(100).nullable(),
    strength: z.string().min(2).max(100).nullable(),
    category: z.string().min(2).max(100).nullable(),
    description: z.string().nullable(),
})