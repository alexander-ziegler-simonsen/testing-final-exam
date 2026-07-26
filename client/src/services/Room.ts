import type { Room } from '../entites/Room';
import { api } from './Api';

const basePath = "/Room";

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
}