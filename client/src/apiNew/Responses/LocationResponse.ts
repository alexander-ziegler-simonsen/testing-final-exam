import { type BuildingResponse, BuildingResponseSchema } from "./BuildingResponse";
import { type FloorRoomsResponse, FloorRoomsResponseSchema } from "./FloorRoomsResponse";
import { z } from 'zod';

export interface LocationResponse {
  building: BuildingResponse;
  floorsWithRooms: FloorRoomsResponse[];
}

export const LocationResponseSchema = z.object({
  building: BuildingResponseSchema,
  floorsWithRooms: z.array(FloorRoomsResponseSchema),
});
