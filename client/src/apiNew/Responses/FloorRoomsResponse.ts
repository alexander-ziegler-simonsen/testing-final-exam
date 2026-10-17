import type { FloorResponse } from "./FloorResponse";
import type { RoomResponse } from "./RoomResponse";
import { z } from "zod";

export interface FloorRoomsResponse {
  Floor: FloorResponse;
  Rooms: RoomResponse[];
}

export const FloorRoomsResponseSchema = z.object({});
