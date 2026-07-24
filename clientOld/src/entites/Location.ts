import type { Building } from "./Building";
import type { FloorRooms } from "./FloorRooms";

export interface Location {
    building: Building;
    floorsWithRooms: FloorRooms[]
}