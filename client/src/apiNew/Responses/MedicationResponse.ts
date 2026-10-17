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
    
})