export interface Prescription {
Id: number;
FkMedicationId: number;
FkTreatmentId: number;
FkPrescribedByStaffId: number;
Doses: number;
}