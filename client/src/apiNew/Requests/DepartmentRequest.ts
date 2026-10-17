
import { z } from 'zod';

export interface  DepartmentRequest
{
    Name: string | null;
    Type: string | null;
}
export const DepartmentRequestSchema = z.object({
    Name: z.string().min(2).max(100).nullable(),
    Type: z.string().min(2).max(100).nullable(),
})
