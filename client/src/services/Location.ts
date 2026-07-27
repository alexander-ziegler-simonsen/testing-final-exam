import type { Floor } from '../entites/Floor';
import type { FloorRooms } from '../entites/FloorRooms';
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

    getAllFloorRooms: () =>
        api.get<FloorRooms[]>(`${basePath}/floor`)
            .then(r => r.data),

    getOneFloorRooms: (id: number) =>
        api.get<FloorRooms>(`${basePath}/floor/${id}`)
            .then(r => r.data),

    putFloor: (id: number, changedFloor: Floor) =>
        api.post<Floor>(`${basePath}/floor/${id}`, changedFloor)
            .then(r => r.data),

    createFloor: (newFloor: Floor) =>
        api.post<Floor>(`${basePath}/floor`, newFloor)
            .then(r => r.data),

    deleteFloor: (id: number) =>
        api.delete<Floor>(`${basePath}/floor/${id}`)
            .then(r => r.data),

    put: (id: number, changedLocation: Location) =>
        api.put<Location>(`${basePath}/${id}`, changedLocation)
            .then(r => r.data),

    delete: (id: number) =>
        api.put<Location>(`${basePath}/${id}`)
            .then(r => r.data),
}