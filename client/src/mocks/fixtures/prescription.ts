import type { HospitalApiDtosOutputsPrescriptionOutputDto } from "../../api";

export const mockPrescription: HospitalApiDtosOutputsPrescriptionOutputDto = {
    id: 8,
    fkMedicationId: 11,
    fkTreatmentId: 6,
    fkPrescribedByStaffId: 7,
    doses: 2,
};

export const mockPrescriptions: HospitalApiDtosOutputsPrescriptionOutputDto[] = [
    mockPrescription,
    { id: 9, fkMedicationId: 12, fkTreatmentId: 6, fkPrescribedByStaffId: 3, doses: 1 },
];
