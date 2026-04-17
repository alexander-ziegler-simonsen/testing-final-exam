import { apiFetch } from "../api/client"
import type { RoomBooking } from "../entites/RoomBooking"

const BASE = "/roombooking"

export interface RoomBookingInput {
    id: number
    fkRoomId: number
    startTime: string
    endTime: string
    fkPatientId: number
}

export const roomBookingService = {
    getAll: async (): Promise<RoomBooking[]> => apiFetch<RoomBooking[]>(BASE),
    getById: async (id: number): Promise<RoomBooking> => apiFetch<RoomBooking>(`${BASE}/${id}`),
    create: async (input: Omit<RoomBookingInput, "id">): Promise<void> =>
        apiFetch<void>(BASE, { method: "POST", body: JSON.stringify({ id: 0, ...input }) }),
    update: async (id: number, input: RoomBookingInput): Promise<void> =>
        apiFetch<void>(`${BASE}/${id}`, { method: "PUT", body: JSON.stringify(input) }),
    delete: async (id: number): Promise<void> =>
        apiFetch<void>(`${BASE}/${id}`, { method: "DELETE" }),
}
