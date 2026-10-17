import { z } from "zod";
import { fail, http } from "../client";
import { type StaffRequest, StaffRequestSchema } from "../Requests/StaffRequest";
import { type StaffResponse, StaffResponseSchema } from "../Responses/StaffResponse";

export const StaffService = {
  getAll: async (): Promise<StaffResponse[]> => {
    const { data } = await http.get("/api/Staff").catch(fail("Failed to load staff"));
    return z.array(StaffResponseSchema).parse(data);
  },

  getById: async (id: number): Promise<StaffResponse> => {
    const { data } = await http.get(`/api/Staff/${id}`).catch(fail(`Failed to load staff ${id}`));
    return StaffResponseSchema.parse(data);
  },

  create: async (newStaff: StaffRequest): Promise<number> => {
    const body = StaffRequestSchema.parse(newStaff);
    const { data } = await http.post("/api/Staff", body).catch(fail("Failed to create staff"));
    // the api answers 204 No Content (no id) when nothing was created
    if (typeof data !== "number") throw new Error("Failed to create staff");
    return data;
  },

  update: async (id: number, changedStaff: StaffRequest): Promise<void> => {
    const body = StaffRequestSchema.parse(changedStaff);
    await http.put(`/api/Staff/${id}`, body).catch(fail(`Failed to update staff ${id}`));
  },

  delete: async (id: number): Promise<void> => {
    await http.delete(`/api/Staff/${id}`).catch(fail(`Failed to delete staff ${id}`));
  },

  getCount: async (): Promise<number> => {
    const { data } = await http.get("/api/Staff/count").catch(fail("Failed to load staff count"));
    return z.number().parse(data);
  },
};
