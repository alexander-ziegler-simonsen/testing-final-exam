export interface MedicationStorageMissing {
    id: number
    fkMedicationStorageId: number
    amountMissing: number
    wentMissingAt: string
}
