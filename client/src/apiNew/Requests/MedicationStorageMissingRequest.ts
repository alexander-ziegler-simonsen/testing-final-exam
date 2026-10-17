
import { z } from 'zod';

export interface MedicationStorageMissingRequest
{
    FkMedicationStorageId: number;
    AmountMissing: number;
    WentMissingAt: Date;
}

export const MedicationStorageMissingRequestSchema = z.object({

})
