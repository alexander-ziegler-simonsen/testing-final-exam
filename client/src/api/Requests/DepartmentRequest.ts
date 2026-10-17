
import { z } from 'zod';

export interface  DepartmentRequest
{
    name: string | null;
    type: string | null;
}
export const DepartmentRequestSchema = z.object({
    name: z.string().min(2).max(100).nullable(),
    type: z.string().min(2).max(100).nullable(),
})
