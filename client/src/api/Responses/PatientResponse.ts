import { z } from "zod";

export interface PatientResponse {
  id: number;
  firstname: string | null;
  lastname: string | null;
  gender: string | null;
  cprNumber: string | null;
  dateOfBirth: Date | null;
  weightKg: number | null;
  heightCm: number | null;
}
export const PatientResponseSchema = z.object({
  id: z.int32(),
  firstname: z.string().min(2).max(100).nullable(),
  lastname: z.string().min(2).max(100).nullable(),
  gender: z.string().min(2).max(50).nullable(),
  cprNumber: z.string().max(10).nullable(),
  dateOfBirth: z.iso
    .date()
    .transform((s) => new Date(s))
    .nullable(),
  weightKg: z.number().nullable(),
  heightCm: z.number().nullable(),
});
