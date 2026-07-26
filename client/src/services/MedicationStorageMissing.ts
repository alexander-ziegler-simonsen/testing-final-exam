import type { MedicationStorageMissing } from '../entites/MedicationStorageMissing';
import { api } from './Api';

const basePath = "/MedicationStorageMissing";

export const MedicationStorageMissingService = {
    getAll: () =>
        api.get<MedicationStorageMissing[]>(basePath)
            .then(r => r.data),

    getById: (id: number) =>
        api.get<MedicationStorageMissing>(`${basePath}/${id}`)
            .then(r => r.data),

    create: (newMedicationStorageMissing: MedicationStorageMissing) =>
        api.post<MedicationStorageMissing>(`${basePath}`, newMedicationStorageMissing)
            .then(r => r.data),
}