import { apiFetch } from "../api/client"
import type { RoomBooking } from "../entites/RoomBooking"

const BASE = "/roombooking"

export const roomBookingService = {
    getAll: async (): Promise<RoomBooking[]> => apiFetch<RoomBooking[]>(BASE),
    getById: async (id: number): Promise<RoomBooking> => apiFetch<RoomBooking>(`${BASE}/${id}`),
}
