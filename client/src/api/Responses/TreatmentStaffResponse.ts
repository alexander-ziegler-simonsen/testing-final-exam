import { z } from "zod";

export interface TreatmentStaffResponse {
  id: number;
  fkTreatmentId: number;
  fkStaffId: number;
}
export const TreatmentStaffResponseSchema = z.object({
  id: z.int32(),
  fkTreatmentId: z.int32(),
  fkStaffId: z.int32(),
});
