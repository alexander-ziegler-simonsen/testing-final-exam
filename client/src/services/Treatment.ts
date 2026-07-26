import type { Treatment } from '../entites/Treatment';
import { api } from './Api';

const basePath = "/Treatment";

export const TreatmentService = {
    getAll: () =>
        api.get<Treatment[]>(basePath)
            .then(r => r.data),

    getById: (id: number) =>
        api.get<Treatment>(`${basePath}/${id}`)
            .then(r => r.data),

    create: (newTreat: Treatment) =>
        api.post<Treatment>(`${basePath}`, newTreat)
            .then(r => r.data),
}