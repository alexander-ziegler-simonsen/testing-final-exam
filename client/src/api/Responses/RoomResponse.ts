import { z } from "zod";

export interface RoomResponse {
  id: number;
  name: string;
  fkFloorId: number;
}
export const RoomResponseSchema = z.object({
  id: z.int32(),
  name: z.string(),
  fkFloorId: z.int32(),
});
