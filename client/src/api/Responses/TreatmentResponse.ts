import { z } from "zod";

export interface TreatmentResponse {
  id: number;
  fkPatientId: number;
  description: string | null;
  time: Date;
}

export const TreatmentResponseSchema = z.object({
  id: z.int32(),
  fkPatientId: z.int32(),
  description: z.string().min(2).max(500).nullable(),
  time: z.iso.datetime({ offset: true, local: true }).transform((s) => new Date(s)),
});
