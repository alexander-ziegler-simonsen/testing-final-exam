import { z } from 'zod';

export interface DepartmentResponse {
  id: number;
  name: string | null;
  type: string | null;
}
export const DepartmentResponseSchema = z.object({
  id: z.int32(),
  name: z.string().min(2).max(100).nullable(),
  type: z.string().min(2).max(100).nullable(),
})