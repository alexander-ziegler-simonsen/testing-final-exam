
import { z } from 'zod';

export interface MedicationStorageMissingRequest
{
    fkMedicationStorageId: number;
    amountMissing: number;
    wentMissingAt: Date;
}

export const MedicationStorageMissingRequestSchema = z.object({
    fkMedicationStorageId: z.int32(),
    amountMissing: z.number(),
    wentMissingAt: z.date(),
})
