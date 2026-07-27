import type { RoomBooking } from '../entites/RoomBooking';
import { api } from './Api';

const basePath = "/RoomBooking";

export const RoomBookingService = {
    getAll: () =>
        api.get<RoomBooking[]>(basePath)
            .then(r => r.data),

    getById: (id: number) =>
        api.get<RoomBooking>(`${basePath}/${id}`)
            .then(r => r.data),

    create: (newRoomBooking: RoomBooking) =>
        api.post<RoomBooking>(`${basePath}`, newRoomBooking)
            .then(r => r.data),

    put: (id: number, changedRoomBooking: RoomBooking) =>
        api.put<RoomBooking>(`${basePath}/${id}`, changedRoomBooking)
            .then(r => r.data),

    delete: (id: number) =>
        api.put<RoomBooking>(`${basePath}/${id}`)
            .then(r => r.data),
}