import { z } from 'zod';

export interface  MedicationStorageResponse
{
    Id : number;   
    FkMedicationId : number;   
    Amount : number;   
}
export const MedicationStorageResponseSchema = z.object({
    Id: z.int32(),
    FkMedicationId: z.int32(),
    Amount: z.number(),
})