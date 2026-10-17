import { z } from "zod";

export interface PrescriptionResponse {
  id: number;
  fkMedicationId: number;
  fkTreatmentId: number;
  fkPrescribedByStaffId: number;
  doses: number;
}
export const PrescriptionResponseSchema = z.object({
  id: z.int32(),
  fkMedicationId: z.int32(),
  fkTreatmentId: z.int32(),
  fkPrescribedByStaffId: z.int32(),
  doses: z.number(),
});
