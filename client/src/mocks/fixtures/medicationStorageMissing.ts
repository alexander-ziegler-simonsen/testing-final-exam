import type { HospitalApiDtosOutputsMedicationStorageMissingOutputDto } from "../../api";

export const mockMissing: HospitalApiDtosOutputsMedicationStorageMissingOutputDto = {
    id: 2,
    fkMedicationStorageId: 5,
    amountMissing: 12,
    wentMissingAt: "2026-06-28T09:15:00",
};

export const mockMissings: HospitalApiDtosOutputsMedicationStorageMissingOutputDto[] = [
    mockMissing,
    { id: 3, fkMedicationStorageId: 8, amountMissing: 4, wentMissingAt: "2026-07-19T22:40:00" },
];
