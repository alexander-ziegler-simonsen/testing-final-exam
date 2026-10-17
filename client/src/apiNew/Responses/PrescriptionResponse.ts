import { z } from 'zod';

export interface PrescriptionResponse
{
    Id : number; 

    FkMedicationId : number; 

    FkTreatmentId : number; 

    FkPrescribedByStaffId : number; 

    Doses : number; 
}
export const PrescriptionResponseSchema = z.object({
    Id: z.int32(),
    FkMedicationId: z.int32(),
    FkTreatmentId: z.int32(),
    FkPrescribedByStaffId: z.int32(),
    Doses: z.number(),
})