import type { HospitalApiDtosOutputsShiftOutputDto } from "../../api";

export const mockShift: HospitalApiDtosOutputsShiftOutputDto = {
    id: 1,
    startTime: "2026-08-04T07:00:00",
    endTime: "2026-08-04T15:00:00",
};

export const mockShifts: HospitalApiDtosOutputsShiftOutputDto[] = [
    mockShift,
    { id: 2, startTime: "2026-08-04T15:00:00", endTime: "2026-08-04T23:00:00" },
    { id: 3, startTime: "2026-08-04T23:00:00", endTime: "2026-08-05T07:00:00" },
];
