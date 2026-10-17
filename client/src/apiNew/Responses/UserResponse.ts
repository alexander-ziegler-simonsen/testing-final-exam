import { z } from "zod";

export interface UserResponse {
  id: number;
  username: string;
  fkStaffId: number | null;
  fkPatientId: number | null;
}
export const UserResponseSchema = z.object({
  id: z.int32(),
  username: z.string().min(2).max(100),
  fkStaffId: z.int32().nullable(),
  fkPatientId: z.int32().nullable(),
});
