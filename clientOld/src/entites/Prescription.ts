export interface Prescription {
    id: number
    fkMedicationId: number
    fkTreatmentId: number
    fkPrescribedByStaffId: number
    doses: number
}
