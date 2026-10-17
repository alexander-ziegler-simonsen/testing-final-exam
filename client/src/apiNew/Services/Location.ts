import { z } from "zod";
import { fail, http } from "../client";
import { type FloorIRequest, FloorIRequestSchema } from "../Requests/FloorIRequest";
import { type LocationResponse, LocationResponseSchema } from "../Responses/LocationResponse";
import { type FloorRoomsResponse, FloorRoomsResponseSchema } from "../Responses/FloorRoomsResponse";

export const LocationService = {
  getAll: async (): Promise<LocationResponse[]> => {
    const { data } = await http.get("/api/Location").catch(fail("Failed to load locations"));
    return z.array(LocationResponseSchema).parse(data);
  },

  getById: async (id: number): Promise<LocationResponse> => {
    const { data } = await http.get(`/api/Location/${id}`).catch(fail(`Failed to load location ${id}`));
    return LocationResponseSchema.parse(data);
  },

  getAllFloorRooms: async (): Promise<FloorRoomsResponse[]> => {
    const { data } = await http.get("/api/Location/floor").catch(fail("Failed to load floors"));
    return z.array(FloorRoomsResponseSchema).parse(data);
  },

  getOneFloorRooms: async (id: number): Promise<FloorRoomsResponse> => {
    const { data } = await http.get(`/api/Location/floor/${id}`).catch(fail(`Failed to load floor ${id}`));
    return FloorRoomsResponseSchema.parse(data);
  },

  createFloor: async (newFloor: FloorIRequest): Promise<number> => {
    const body = FloorIRequestSchema.parse(newFloor);
    const { data } = await http.post("/api/Location/floor", body).catch(fail("Failed to create floor"));
    // the api answers 204 No Content (no id) when nothing was created
    if (typeof data !== "number") throw new Error("Failed to create floor");
    return data;
  },

  putFloor: async (id: number, changedFloor: FloorIRequest): Promise<void> => {
    const body = FloorIRequestSchema.parse(changedFloor);
    await http.put(`/api/Location/floor/${id}`, body).catch(fail(`Failed to update floor ${id}`));
  },

  deleteFloor: async (id: number): Promise<void> => {
    await http.delete(`/api/Location/floor/${id}`).catch(fail(`Failed to delete floor ${id}`));
  },
};
