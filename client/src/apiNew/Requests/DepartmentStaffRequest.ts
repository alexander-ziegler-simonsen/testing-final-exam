
import { z } from 'zod';

export interface DepartmentStaffRequest
{
    FkStaffId: number;

    FkDepartmentId: number;
}

export const DepartmentStaffRequestSchema = z.object({

})