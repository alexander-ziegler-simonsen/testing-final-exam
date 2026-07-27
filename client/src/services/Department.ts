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

    put: (id: number, changedDepartment: Department) =>
        api.put<Department>(`${basePath}/${id}`, changedDepartment)
            .then(r => r.data),

    delete: (id: number) =>
        api.put<Department>(`${basePath}/${id}`)
            .then(r => r.data),
}