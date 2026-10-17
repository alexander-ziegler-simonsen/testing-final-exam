import { z } from 'zod';

export interface  MedicationStorageMissingResponse
{
    Id :  number; 

    FkMedicationStorageId :  number; 

    AmountMissing :  number; 

    WentMissingAt :  Date; 
}
export const MedicationStorageMissingResponseSchema = z.object({
    Id: z.int32(),
    FkMedicationStorageId: z.int32(),
    AmountMissing: z.number(),
    WentMissingAt: z.iso.datetime({ offset: true, local: true }).transform((s) => new Date(s)),
})