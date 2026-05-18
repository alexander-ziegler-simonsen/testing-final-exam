import { apiFetch } from "../api/client";
import type { Location } from "../entites/Location";
import type { FloorRooms } from "../entites/FloorRooms";

const BASE = "/location";

export interface FloorInput {
    id: number;
    name: string;
    fkBuildingId: number;
}

export const locationService = {
    // GET api/location
    getAll: async (): Promise<Location[]> => apiFetch<Location[]>(BASE),

    // GET api/location/{id}
    getById: async (id: number): Promise<Location> => apiFetch<Location>(`${BASE}/${id}`),

    // GET api/location/floor
    getAllFloors: async (): Promise<FloorRooms[]> => apiFetch<FloorRooms[]>(`${BASE}/floor`),

    // GET api/location/floor/{id}
    getFloorById: async (id: number): Promise<FloorRooms> => apiFetch<FloorRooms>(`${BASE}/floor/${id}`),

    // POST api/location/floor
    createFloor: async (input: Omit<FloorInput, "id">): Promise<number> =>
        apiFetch<number>(`${BASE}/floor`, { method: "POST", body: JSON.stringify({ id: 0, ...input }) }),

    // PUT api/location/floor/{id}
    updateFloor: async (id: number, input: FloorInput): Promise<void> =>
        apiFetch<void>(`${BASE}/floor/${id}`, { method: "PUT", body: JSON.stringify(input) }),

    // DELETE api/location/floor/{id}
    deleteFloor: async (id: number): Promise<void> =>
        apiFetch<void>(`${BASE}/floor/${id}`, { method: "DELETE" }),
};