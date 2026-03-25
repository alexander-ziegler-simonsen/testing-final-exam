import type { Floor } from "./Floor";
import type { Room } from "./Room";

export interface FloorRooms {
    floor: Floor;
    rooms: Room[];
}