import type { DepartmentResponse } from "./DepartmentResponse";
import type { StaffResponse } from "./StaffResponse";
import { z } from 'zod';

export interface DepartmentStaffResponse {
  Id: number;
  Department: DepartmentResponse;
  Staff: StaffResponse;
}
export const DepartmentStaffResponseSchema = z.object({
    
})