import { z } from 'zod';

export interface  MedicationStorageRequest
{
    fkMedicationId: number;
    amount: number;
}

export const MedicationStorageRequestSchema = z.object({
    fkMedicationId: z.int32(),
    amount: z.number(),
})