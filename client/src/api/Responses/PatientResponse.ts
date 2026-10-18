import { z } from "zod";

export interface PatientResponse {
  id: number;
  firstname: string;
  lastname: string;
  gender: string;
  cprNumber: string;
  dateOfBirth: Date;
  weightKg: number | null;
  heightCm: number | null;
}
export const PatientResponseSchema = z.object({
  id: z.int32(),
  firstname: z.string().min(2).max(100),
  lastname: z.string().min(2).max(100),
  gender: z.string().min(2).max(50),
  cprNumber: z.string().max(10),
  dateOfBirth: z.iso
    .date()
    .transform((s) => new Date(s)),
  weightKg: z.number().nullable(),
  heightCm: z.number().nullable(),
});
