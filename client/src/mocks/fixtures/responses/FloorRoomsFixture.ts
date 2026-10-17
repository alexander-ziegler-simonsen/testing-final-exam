import type { FloorRoomsResponse } from "../../../api/Responses/FloorRoomsResponse";
import { mockFloorResponse, mockFloorResponses } from "./FloorFixture";
import { mockRoomResponses } from "./RoomFixture";

const roomsOnFloor = (floorId: number) => mockRoomResponses.filter((room) => room.fkFloorId === floorId);

export const mockFloorRoomsResponse: FloorRoomsResponse = {
    floor: mockFloorResponse,
    rooms: roomsOnFloor(mockFloorResponse.id),
};

// floor 3 has no rooms, so its rooms array is empty
export const mockFloorRoomsResponses: FloorRoomsResponse[] = mockFloorResponses.map((floor) => ({
    floor,
    rooms: roomsOnFloor(floor.id),
}));

// the only nullable field is the nested floor.name
export const mockFloorRoomsResponsesWithNulls: FloorRoomsResponse[] = [
    { ...mockFloorRoomsResponse, floor: { ...mockFloorResponse, name: null } },
];
