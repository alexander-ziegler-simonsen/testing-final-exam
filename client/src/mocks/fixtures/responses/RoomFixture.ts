import type { RoomResponse } from "../../../api/Responses/RoomResponse";

export const mockRoomResponse: RoomResponse = { id: 1, name: "Room 001", fkFloorId: 1 };

export const mockRoomResponses: RoomResponse[] = [
    mockRoomResponse,
    { id: 2, name: "Room 002", fkFloorId: 1 },
    { id: 3, name: "Room 101", fkFloorId: 2 },
];
