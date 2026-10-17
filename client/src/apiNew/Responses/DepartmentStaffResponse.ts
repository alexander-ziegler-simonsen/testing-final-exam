import { type DepartmentResponse, DepartmentResponseSchema } from "./DepartmentResponse";
import { type StaffResponse, StaffResponseSchema } from "./StaffResponse";
import { z } from 'zod';

export interface DepartmentStaffResponse {
  Id: number;
  Department: DepartmentResponse;
  Staff: StaffResponse;
}
export const DepartmentStaffResponseSchema = z.object({
  Id: z.int32(),
  Department: DepartmentResponseSchema,
  Staff: StaffResponseSchema,
})