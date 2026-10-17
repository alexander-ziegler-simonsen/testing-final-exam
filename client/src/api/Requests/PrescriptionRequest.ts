import { z } from 'zod';

export interface PrescriptionRequest {
  fkMedicationId: number;
  fkTreatmentId: number;
  fkPrescribedByStaffId: number;
  doses: number;
}
export const PrescriptionRequestSchema = z.object({
  fkMedicationId: z.int32(),
  fkTreatmentId: z.int32(),
  fkPrescribedByStaffId: z.int32(),
  doses: z.number(),
})