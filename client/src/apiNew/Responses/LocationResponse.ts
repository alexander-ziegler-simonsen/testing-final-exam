import { type BuildingResponse, BuildingResponseSchema } from "./BuildingResponse";
import { type FloorRoomsResponse, FloorRoomsResponseSchema } from "./FloorRoomsResponse";
import { z } from 'zod';

export interface LocationResponse {
  Building: BuildingResponse;
  FloorsWithRooms: FloorRoomsResponse[];
}

export const LocationResponseSchema = z.object({
  Building: BuildingResponseSchema,
  FloorsWithRooms: z.array(FloorRoomsResponseSchema),
});
