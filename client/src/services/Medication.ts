import type { Medication } from '../entites/Medication';
import { api } from './Api';

const basePath = "/Medicin";

export const MedicationService = {
    getAll: () => api.get<Medication[]>(basePath).then(r => r.data),

    getById: (id: number) => api.get<Medication>(`${basePath}/${id}`).then(r => r.data),

    create: (newMed: Medication) => api.post<Medication>(`${basePath}`, newMed).then(r => r.data),
}