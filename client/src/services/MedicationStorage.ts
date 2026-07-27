import type { MedicationStorage } from '../entites/MedicationStorage';
import { api } from './Api';

const basePath = "/MedicationStorage";

export const MedicationStorageService = {
    getAll: () =>
        api.get<MedicationStorage[]>(basePath)
            .then(r => r.data),

    getById: (id: number) =>
        api.get<MedicationStorage>(`${basePath}/${id}`)
            .then(r => r.data),

    create: (newMedicationStorage: MedicationStorage) =>
        api.post<MedicationStorage>(`${basePath}`, newMedicationStorage)
            .then(r => r.data),

    put: (id: number, changedMedicationStorage: MedicationStorage) =>
        api.put<MedicationStorage>(`${basePath}/${id}`, changedMedicationStorage)
            .then(r => r.data),

    delete: (id: number) =>
        api.put<MedicationStorage>(`${basePath}/${id}`)
            .then(r => r.data),
}