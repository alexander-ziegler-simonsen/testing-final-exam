import type { Shift } from '../entites/Shift';
import { api } from './Api';

const basePath = "/Shift";

export const ShiftService = {
    getAll: () =>
        api.get<Shift[]>(basePath)
            .then(r => r.data),

    getById: (id: number) =>
        api.get<Shift>(`${basePath}/${id}`)
            .then(r => r.data),

    create: (newShift: Shift) =>
        api.post<Shift>(`${basePath}`, newShift)
            .then(r => r.data),

    put: (id: number, changedShift: Shift) =>
        api.put<Shift>(`${basePath}/${id}`, changedShift)
            .then(r => r.data),

    delete: (id: number) =>
        api.put<Shift>(`${basePath}/${id}`)
            .then(r => r.data),
}