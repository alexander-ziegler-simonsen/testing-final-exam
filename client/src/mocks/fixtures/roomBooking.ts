import type { HospitalApiDtosOutputsRoomBookingOutputDto } from "../../api";

export const mockRoomBooking: HospitalApiDtosOutputsRoomBookingOutputDto = {
    id: 4,
    fkRoomId: 14,
    startTime: "2026-08-04T08:30:00",
    endTime: "2026-08-04T09:00:00",
    fkPatientId: 42,
};

export const mockRoomBookings: HospitalApiDtosOutputsRoomBookingOutputDto[] = [
    mockRoomBooking,
    {
        id: 5,
        fkRoomId: 21,
        startTime: "2026-08-04T13:00:00",
        endTime: "2026-08-04T13:45:00",
        fkPatientId: 43,
    },
];
