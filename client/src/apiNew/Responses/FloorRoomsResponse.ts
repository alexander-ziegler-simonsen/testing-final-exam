import { type FloorResponse, FloorResponseSchema } from "./FloorResponse";
import { type RoomResponse, RoomResponseSchema } from "./RoomResponse";
import { z } from "zod";

export interface FloorRoomsResponse {
  Floor: FloorResponse;
  Rooms: RoomResponse[];
}

export const FloorRoomsResponseSchema = z.object({
  Floor: FloorResponseSchema,
  Rooms: z.array(RoomResponseSchema),
});
