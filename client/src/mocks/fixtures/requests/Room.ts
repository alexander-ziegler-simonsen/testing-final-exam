import type { RoomRequest } from "../../../api/Requests/RoomRequest";

export const mockRoomRequest: RoomRequest = { name: "Room 001", fkFloorId: 1 };

export const mockRoomRequests: RoomRequest[] = [
    mockRoomRequest,
    { name: "Room 002", fkFloorId: 1 },
    { name: "Room 101", fkFloorId: 2 },
];
