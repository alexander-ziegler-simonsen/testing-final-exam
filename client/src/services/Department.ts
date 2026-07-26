import type { Department } from '../entites/Department';
import { api } from './Api';

const basePath = "/Department";

export const DepartmentService = {
    getAll: () =>
        api.get<Department[]>(basePath)
            .then(r => r.data),

    getById: (id: number) =>
        api.get<Department>(`${basePath}/${id}`)
            .then(r => r.data),

    create: (newDepartment: Department) =>
        api.post<Department>(`${basePath}`, newDepartment)
            .then(r => r.data),
}