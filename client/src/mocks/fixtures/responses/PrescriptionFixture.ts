import type { PrescriptionResponse } from "../../../api/Responses/PrescriptionResponse";

export const mockPrescriptionResponse: PrescriptionResponse = {
    id: 1,
    fkMedicationId: 1,
    fkTreatmentId: 1,
    fkPrescribedByStaffId: 1,
    doses: 2,
};

export const mockPrescriptionResponses: PrescriptionResponse[] = [
    mockPrescriptionResponse,
    { id: 2, fkMedicationId: 3, fkTreatmentId: 2, fkPrescribedByStaffId: 1, doses: 3 },
    { id: 3, fkMedicationId: 2, fkTreatmentId: 3, fkPrescribedByStaffId: 2, doses: 1 },
];
