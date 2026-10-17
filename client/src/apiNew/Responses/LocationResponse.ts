import type { BuildingResponse } from "./BuildingResponse";
import type { FloorRoomsResponse } from "./FloorRoomsResponse";
import { z } from 'zod';

export interface LocationResponse {
  Building: BuildingResponse;
  FloorsWithRooms: FloorRoomsResponse[];
}

export const LocationResponseSchema = z.object({});
