import { z } from "zod";
import { fail, http } from "../client";
import { type MedicationRequest, MedicationRequestSchema } from "../Requests/MedicationRequest";
import { type MedicationResponse, MedicationResponseSchema } from "../Responses/MedicationResponse";

export const MedicationService = {
  getAll: async (): Promise<MedicationResponse[]> => {
    const { data } = await http.get("/api/Medicin").catch(fail("Failed to load medications"));
    return z.array(MedicationResponseSchema).parse(data);
  },

  getById: async (id: number): Promise<MedicationResponse> => {
    const { data } = await http.get(`/api/Medicin/${id}`).catch(fail(`Failed to load medication ${id}`));
    return MedicationResponseSchema.parse(data);
  },

  create: async (newMedication: MedicationRequest): Promise<number> => {
    const body = MedicationRequestSchema.parse(newMedication);
    const { data } = await http.post("/api/Medicin", body).catch(fail("Failed to create medication"));
    // the api answers 204 No Content (no id) when nothing was created
    if (typeof data !== "number") throw new Error("Failed to create medication");
    return data;
  },

  update: async (id: number, changedMedication: MedicationRequest): Promise<void> => {
    const body = MedicationRequestSchema.parse(changedMedication);
    await http.put(`/api/Medicin/${id}`, body).catch(fail(`Failed to update medication ${id}`));
  },

  delete: async (id: number): Promise<void> => {
    await http.delete(`/api/Medicin/${id}`).catch(fail(`Failed to delete medication ${id}`));
  },
};
