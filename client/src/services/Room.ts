import {

} from '../api';
import {

} from '../api/zod.gen';
import type {

} from '../api';

export const RoomService = {
    getAll: () =>
        api.get<Room[]>(basePath)
            .then(r => r.data),

    getById: (id: number) =>
        api.get<Room>(`${basePath}/${id}`)
            .then(r => r.data),

    create: (newRoom: Room) =>
        api.post<Room>(`${basePath}`, newRoom)
            .then(r => r.data),

    put: (id: number, changedRoom: Room) =>
        api.put<Room>(`${basePath}/${id}`, changedRoom)
            .then(r => r.data),

    delete: (id: number) =>
        api.put<Room>(`${basePath}/${id}`)
            .then(r => r.data),
}