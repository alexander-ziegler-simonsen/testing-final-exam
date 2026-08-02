import type { HospitalApiDtosOutputsMedicationStorageOutputDto } from "../../api";

export const mockStorage: HospitalApiDtosOutputsMedicationStorageOutputDto = {
    id: 5,
    fkMedicationId: 11,
    amount: 142,
};

export const mockStorages: HospitalApiDtosOutputsMedicationStorageOutputDto[] = [
    mockStorage,
    { id: 6, fkMedicationId: 12, amount: 30 },
    { id: 8, fkMedicationId: 19, amount: 0 },
];
