import { z } from 'zod';

export interface DepartmentResponse {
  Id: number;
  Name: string | null;
  Type: string | null;
}
export const DepartmentResponseSchema = z.object({
    
})