import type { Patient } from '../entites/Patient';
import { api } from './Api';

const basePath = "/Patient";

export const PatientService = {
    getAll: () =>
        api.get<Patient[]>(basePath)
            .then(r => r.data),

    getById: (id: number) =>
        api.get<Patient>(`${basePath}/${id}`)
            .then(r => r.data),

    create: (newPatient: Patient) =>
        api.post<Patient>(`${basePath}`, newPatient)
            .then(r => r.data),

    put: (id: number, changedPatient: Patient) =>
        api.put<Patient>(`${basePath}/${id}`, changedPatient)
            .then(r => r.data),

    delete: (id: number) =>
        api.put<Patient>(`${basePath}/${id}`)
            .then(r => r.data),
}