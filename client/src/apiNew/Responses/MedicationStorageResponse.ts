import { z } from 'zod';

export interface  MedicationStorageResponse
{
    id : number;   
    fkMedicationId : number;   
    amount : number;   
}
export const MedicationStorageResponseSchema = z.object({
    id: z.int32(),
    fkMedicationId: z.int32(),
    amount: z.number(),
})