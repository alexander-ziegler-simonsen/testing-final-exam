import { type FloorResponse, FloorResponseSchema } from "./FloorResponse";
import { type RoomResponse, RoomResponseSchema } from "./RoomResponse";
import { z } from "zod";

export interface FloorRoomsResponse {
  floor: FloorResponse;
  rooms: RoomResponse[];
}

export const FloorRoomsResponseSchema = z.object({
  floor: FloorResponseSchema,
  rooms: z.array(RoomResponseSchema),
});
