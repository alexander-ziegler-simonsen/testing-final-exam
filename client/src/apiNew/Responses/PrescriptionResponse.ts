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
    
})