import type { z } from "zod";
import type { RoomBookingResponseSchema } from "../../../api/Responses/RoomBookingResponse";

// wire format (what the api sends): startTime/endTime are ISO strings, the schema turns them into Dates when parsing
type RoomBookingResponseJson = z.input<typeof RoomBookingResponseSchema>;

export const mockRoomBookingResponse: RoomBookingResponseJson = {
    id: 1,
    fkRoomId: 1,
    startTime: "2026-10-20T08:00:00Z",
    endTime: "2026-10-23T12:00:00Z",
    fkPatientId: 1,
};

export const mockRoomBookingResponses: RoomBookingResponseJson[] = [
    mockRoomBookingResponse,
    { id: 2, fkRoomId: 2, startTime: "2026-10-21T13:00:00Z", endTime: "2026-10-21T18:00:00Z", fkPatientId: 2 },
    { id: 3, fkRoomId: 3, startTime: "2026-10-24T09:00:00Z", endTime: "2026-10-26T09:00:00Z", fkPatientId: 3 },
];
