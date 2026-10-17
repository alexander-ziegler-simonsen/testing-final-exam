import { z } from 'zod';

export interface MedicationResponse {
  Id: number;

  Name: string | null;
  GenericName: string | null;
  Brand: string | null;
  Form: string | null;
  Strength: string | null;
  Category: string | null;
  Description: string | null;
}
export const MedicationResponseSchema = z.object({
  Id: z.int32(),
  Name: z.string().min(2).max(100).nullable(),
  GenericName: z.string().min(2).max(100).nullable(),
  Brand: z.string().min(2).max(100).nullable(),
  Form: z.string().min(2).max(100).nullable(),
  Strength: z.string().min(2).max(100).nullable(),
  Category: z.string().min(2).max(100).nullable(),
  Description: z.string().nullable(),
})