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
    
})