import { z } from 'zod';

export interface  MedicationStorageRequest
{
    FkMedicationId: number;
    Amount: number;
}

export const MedicationStorageRequestSchema = z.object({
    
})