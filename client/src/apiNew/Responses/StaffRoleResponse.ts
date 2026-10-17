import { z } from "zod";

export interface StaffRoleResponse {
  id: number;
  name: string;
}

export const StaffRoleResponseSchema = z.object({
  id: z.int32(),
  name: z.string().min(2).max(50),
});
