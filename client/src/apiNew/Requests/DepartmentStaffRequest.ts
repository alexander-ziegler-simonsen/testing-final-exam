
import { z } from 'zod';

export interface DepartmentStaffRequest
{
    FkStaffId: number;

    FkDepartmentId: number;
}

export const DepartmentStaffRequestSchema = z.object({
    FkStaffId: z.int32(),
    FkDepartmentId: z.int32(),
})