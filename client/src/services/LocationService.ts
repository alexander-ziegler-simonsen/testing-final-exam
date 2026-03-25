import { apiFetch } from "../api/client";
import type { Location } from "../entites/Location";

const BASE = "/location";

export const locationService = {
    // GET api/location
    getAll: async (): Promise<Location[]> => {
        return apiFetch<Location[]>(BASE);
    },

    // GET api/location/{id}
    getById: async (id: number): Promise<Location> => {
        return apiFetch<Location>(`${BASE}/${id}`);
    },
};