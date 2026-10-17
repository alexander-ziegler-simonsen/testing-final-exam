import type { RoomBookingRequest } from "../../../api/Requests/RoomBookingRequest";

export const mockRoomBookingRequest: RoomBookingRequest = {
    fkRoomId: 1,
    startTime: new Date("2026-10-20T08:00:00Z"),
    endTime: new Date("2026-10-23T12:00:00Z"),
    fkPatientId: 1,
};

export const mockRoomBookingRequests: RoomBookingRequest[] = [
    mockRoomBookingRequest,
    { fkRoomId: 2, startTime: new Date("2026-10-21T13:00:00Z"), endTime: new Date("2026-10-21T18:00:00Z"), fkPatientId: 2 },
    { fkRoomId: 3, startTime: new Date("2026-10-24T09:00:00Z"), endTime: new Date("2026-10-26T09:00:00Z"), fkPatientId: 3 },
];
