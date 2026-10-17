import { z } from 'zod';

export interface DepartmentResponse {
  Id: number;
  Name: string | null;
  Type: string | null;
}
export const DepartmentResponseSchema = z.object({
  Id: z.int32(),
  Name: z.string().min(2).max(100).nullable(),
  Type: z.string().min(2).max(100).nullable(),
})