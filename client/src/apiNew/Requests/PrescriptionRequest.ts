import { z } from 'zod';

export interface PrescriptionRequest {
  FkMedicationId: number;
  FkTreatmentId: number;
  FkPrescribedByStaffId: number;
  Doses: number;
}
export const PrescriptionRequestSchema = z.object({
    
})