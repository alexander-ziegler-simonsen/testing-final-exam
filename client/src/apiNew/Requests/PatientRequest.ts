import { z } from 'zod';

export interface PatientRequest {
  Firstname: string | null;
  Lastname: string | null;
  Gender: string | null;
  CprNumber: string | null;
  DateOfBirth: Date | null;
  WeightKg: number | null;
  HeightCm: number | null;
}

export const PatientRequestSchema = z.object({
  Firstname: z.string().min(2).max(100).nullable(),
  Lastname: z.string().min(2).max(100).nullable(),
  Gender: z.string().min(2).max(50).nullable(),
  CprNumber: z.string().max(10).nullable(),
  DateOfBirth: z.date().nullable(),
  WeightKg: z.number().nullable(),
  HeightCm: z.number().nullable(),
})
