
import { z } from 'zod';

export interface  DepartmentRequest
{
    Name: string | null;
    Type: string | null;
}
export const DepartmentRequestSchema = z.object({

})
