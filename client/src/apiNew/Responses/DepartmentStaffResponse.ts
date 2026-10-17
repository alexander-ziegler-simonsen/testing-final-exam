import { type DepartmentResponse, DepartmentResponseSchema } from "./DepartmentResponse";
import { type StaffResponse, StaffResponseSchema } from "./StaffResponse";
import { z } from 'zod';

export interface DepartmentStaffResponse {
  id: number;
  department: DepartmentResponse;
  staff: StaffResponse;
}
export const DepartmentStaffResponseSchema = z.object({
  id: z.int32(),
  department: DepartmentResponseSchema,
  staff: StaffResponseSchema,
})