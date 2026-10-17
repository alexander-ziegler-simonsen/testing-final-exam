
import { z } from 'zod';

export interface DepartmentStaffRequest
{
    fkStaffId: number;
    fkDepartmentId: number;
}

export const DepartmentStaffRequestSchema = z.object({
    fkStaffId: z.int32(),
    fkDepartmentId: z.int32(),
})