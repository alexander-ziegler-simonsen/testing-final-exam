import { z } from 'zod';

export interface  MedicationStorageMissingResponse
{
    Id :  number; 

    FkMedicationStorageId :  number; 

    AmountMissing :  number; 

    WentMissingAt :  Date; 
}
export const MedicationStorageMissingResponseSchema = z.object({
    
})