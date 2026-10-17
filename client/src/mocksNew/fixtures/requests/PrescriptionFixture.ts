import type { PrescriptionRequest } from "../../../api/Requests/PrescriptionRequest";

export const mockPrescriptionRequest: PrescriptionRequest = {
    fkMedicationId: 1,
    fkTreatmentId: 1,
    fkPrescribedByStaffId: 1,
    doses: 2,
};

export const mockPrescriptionRequests: PrescriptionRequest[] = [
    mockPrescriptionRequest,
    { fkMedicationId: 3, fkTreatmentId: 2, fkPrescribedByStaffId: 1, doses: 3 },
    { fkMedicationId: 2, fkTreatmentId: 3, fkPrescribedByStaffId: 2, doses: 1 },
];
