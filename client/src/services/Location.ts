import type { Location } from '../entites/Location';
import { api } from './Api';

const basePath = "/Location";

export const LocationService = {
    getAll: () =>
        api.get<Location[]>(basePath)
            .then(r => r.data),

    getById: (id: number) =>
        api.get<Location>(`${basePath}/${id}`)
            .then(r => r.data),

    create: (newLocation: Location) =>
        api.post<Location>(`${basePath}`, newLocation)
            .then(r => r.data),
}