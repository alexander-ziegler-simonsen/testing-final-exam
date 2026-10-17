import { z } from 'zod';

export interface PatientRequest {
  firstname: string | null;
  lastname: string | null;
  gender: string | null;
  cprNumber: string | null;
  dateOfBirth: Date | null;
  weightKg: number | null;
  heightCm: number | null;
}

export const PatientRequestSchema = z.object({
  firstname: z.string().min(2).max(100).nullable(),
  lastname: z.string().min(2).max(100).nullable(),
  gender: z.string().min(2).max(50).nullable(),
  cprNumber: z.string().max(10).nullable(),
  // the api field is a C# DateOnly, which only accepts "yyyy-MM-dd" (not a full ISO timestamp).
  // UTC is used so it round-trips with PatientResponse, where new Date("yyyy-MM-dd") is UTC midnight.
  dateOfBirth: z.date().transform((d) => d.toISOString().slice(0, 10)).nullable(),
  weightKg: z.number().nullable(),
  heightCm: z.number().nullable(),
})
