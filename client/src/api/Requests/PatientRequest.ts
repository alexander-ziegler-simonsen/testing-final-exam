import { z } from 'zod';

export interface PatientRequest {
  firstname: string;
  lastname: string;
  gender: string;
  cprNumber: string;
  dateOfBirth: Date;
  weightKg: number | null;
  heightCm: number | null;
}

export const PatientRequestSchema = z.object({
  firstname: z.string().min(2).max(100),
  lastname: z.string().min(2).max(100),
  gender: z.string().min(2).max(50),
  cprNumber: z.string().max(10),
  // the api field is a C# DateOnly, which only accepts "yyyy-MM-dd" (not a full ISO timestamp).
  // UTC is used so it round-trips with PatientResponse, where new Date("yyyy-MM-dd") is UTC midnight.
  dateOfBirth: z.date().transform((d) => d.toISOString().slice(0, 10)),
  weightKg: z.number().nullable(),
  heightCm: z.number().nullable(),
})
