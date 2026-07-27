import type { Staff } from '../entites/Staff';
import { api } from './Api';

const basePath = "/Staff";

export const StaffService = {
    getAll: () =>
        api.get<Staff[]>(basePath)
            .then(r => r.data),

    getById: (id: number) =>
        api.get<Staff>(`${basePath}/${id}`)
            .then(r => r.data),

    create: (newStaff: Staff) =>
        api.post<Staff>(`${basePath}`, newStaff)
            .then(r => r.data),

    put: (id: number, changedStaff: Staff) =>
        api.put<Staff>(`${basePath}/${id}`, changedStaff)
            .then(r => r.data),

    delete: (id: number) =>
        api.put<Staff>(`${basePath}/${id}`)
            .then(r => r.data),
}