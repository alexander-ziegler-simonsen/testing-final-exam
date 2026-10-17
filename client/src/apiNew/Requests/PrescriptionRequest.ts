import { z } from 'zod';

export interface PrescriptionRequest {
  FkMedicationId: number;
  FkTreatmentId: number;
  FkPrescribedByStaffId: number;
  Doses: number;
}
export const PrescriptionRequestSchema = z.object({
  FkMedicationId: z.int32(),
  FkTreatmentId: z.int32(),
  FkPrescribedByStaffId: z.int32(),
  Doses: z.number(),
})