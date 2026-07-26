import type { Prescription } from '../entites/Prescription';
import { api } from './Api';

const basePath = "/Prescription";

export const PrescriptionService = {
    getAll: () =>
        api.get<Prescription[]>(basePath)
            .then(r => r.data),

    getById: (id: number) =>
        api.get<Prescription>(`${basePath}/${id}`)
            .then(r => r.data),

    create: (newPrescription: Prescription) =>
        api.post<Prescription>(`${basePath}`, newPrescription)
            .then(r => r.data),
}