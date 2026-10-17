import { z } from 'zod';

export interface RegisterBabyRequest {
  Firstname: string | null;
  Lastname: string | null;
  WeightKg: number;
  HeightCm: number;
  Gender: string | null;
  DateOfBirth: Date;
}
export const RegisterBabyRequestSchema = z.object({
  Firstname: z.string().min(2).max(100).nullable(),
  Lastname: z.string().min(2).max(100).nullable(),
  WeightKg: z.number().min(0, { error: 'Weight must be between 0 and 20 kg.' }).max(20, { error: 'Weight must be between 0 and 20 kg.' }),
  HeightCm: z.number().min(0, { error: 'Height must be between 0 and 80 cm.' }).max(80, { error: 'Height must be between 0 and 80 cm.' }),
  Gender: z.string().nullable(),
  DateOfBirth: z.date(),
})