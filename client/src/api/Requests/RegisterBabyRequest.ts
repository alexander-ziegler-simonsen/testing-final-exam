import { z } from 'zod';

export interface RegisterBabyRequest {
  firstname: string | null;
  lastname: string | null;
  weightKg: number;
  heightCm: number;
  gender: string | null;
  dateOfBirth: Date;
}
export const RegisterBabyRequestSchema = z.object({
  firstname: z.string().min(2).max(100).nullable(),
  lastname: z.string().min(2).max(100).nullable(),
  weightKg: z.number().min(0, { error: 'Weight must be between 0 and 20 kg.' }).max(20, { error: 'Weight must be between 0 and 20 kg.' }),
  heightCm: z.number().min(0, { error: 'Height must be between 0 and 80 cm.' }).max(80, { error: 'Height must be between 0 and 80 cm.' }),
  gender: z.string().nullable(),
  // the api field is a C# DateOnly, which only accepts "yyyy-MM-dd" (not a full ISO timestamp)
  dateOfBirth: z.date().transform((d) => d.toISOString().slice(0, 10)),
})