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

})
