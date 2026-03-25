export interface MedicationStorageMissing {
    id: number;
    fkMedicationStorageId: number;
    amountMissing: number;
    wentMissinAt: Date;
}