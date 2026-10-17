import { z } from "zod";

export interface StaffResponse {
  id: number;
  firstname: string | null;
  lastname: string | null;
  fkRoleId: number;
}
export const StaffResponseSchema = z.object({
  id: z.int32(),
  firstname: z.string().min(2).max(100).nullable(),
  lastname: z.string().min(2).max(100).nullable(),
  fkRoleId: z.int32(),
});
