import { z } from "zod";
import { fail, http } from "../client";
import { type TreatmentStaffRequest, TreatmentStaffRequestSchema } from "../Requests/TreatmentStaffRequest";
import { type TreatmentStaffResponse, TreatmentStaffResponseSchema } from "../Responses/TreatmentStaffResponse";

export const TreatmentStaffService = {
  getAll: async (): Promise<TreatmentStaffResponse[]> => {
    const { data } = await http.get("/api/TreatmentStaff").catch(fail("Failed to load treatment staff"));
    return z.array(TreatmentStaffResponseSchema).parse(data);
  },

  getById: async (id: number): Promise<TreatmentStaffResponse> => {
    const { data } = await http.get(`/api/TreatmentStaff/${id}`).catch(fail(`Failed to load treatment staff ${id}`));
    return TreatmentStaffResponseSchema.parse(data);
  },

  create: async (newTreatmentStaff: TreatmentStaffRequest): Promise<number> => {
    const body = TreatmentStaffRequestSchema.parse(newTreatmentStaff);
    const { data } = await http.post("/api/TreatmentStaff", body).catch(fail("Failed to create treatment staff"));
    // the api answers 204 No Content (no id) when nothing was created
    if (typeof data !== "number") throw new Error("Failed to create treatment staff");
    return data;
  },

  update: async (id: number, changedTreatmentStaff: TreatmentStaffRequest): Promise<void> => {
    const body = TreatmentStaffRequestSchema.parse(changedTreatmentStaff);
    await http.put(`/api/TreatmentStaff/${id}`, body).catch(fail(`Failed to update treatment staff ${id}`));
  },

  delete: async (id: number): Promise<void> => {
    await http.delete(`/api/TreatmentStaff/${id}`).catch(fail(`Failed to delete treatment staff ${id}`));
  },
};
