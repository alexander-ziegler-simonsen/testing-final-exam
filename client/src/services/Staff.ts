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
}