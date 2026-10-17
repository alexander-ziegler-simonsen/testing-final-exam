import { z } from "zod";
import { fail, http } from "../client";
import { type MedicationStorageMissingRequest, MedicationStorageMissingRequestSchema } from "../Requests/MedicationStorageMissingRequest";
import { type MedicationStorageMissingResponse, MedicationStorageMissingResponseSchema } from "../Responses/MedicationStorageMissingResponse";

export const MedicationStorageMissingService = {
  getAll: async (): Promise<MedicationStorageMissingResponse[]> => {
    const { data } = await http.get("/api/MissingStorage").catch(fail("Failed to load missing medication storages"));
    return z.array(MedicationStorageMissingResponseSchema).parse(data);
  },

  getById: async (id: number): Promise<MedicationStorageMissingResponse> => {
    const { data } = await http.get(`/api/MissingStorage/${id}`).catch(fail(`Failed to load missing medication storage ${id}`));
    return MedicationStorageMissingResponseSchema.parse(data);
  },

  create: async (newMedicationStorageMissing: MedicationStorageMissingRequest): Promise<number> => {
    const body = MedicationStorageMissingRequestSchema.parse(newMedicationStorageMissing);
    const { data } = await http.post("/api/MissingStorage", body).catch(fail("Failed to create missing medication storage"));
    // the api answers 204 No Content (no id) when nothing was created
    if (typeof data !== "number") throw new Error("Failed to create missing medication storage");
    return data;
  },

  update: async (id: number, changedMedicationStorageMissing: MedicationStorageMissingRequest): Promise<void> => {
    const body = MedicationStorageMissingRequestSchema.parse(changedMedicationStorageMissing);
    await http.put(`/api/MissingStorage/${id}`, body).catch(fail(`Failed to update missing medication storage ${id}`));
  },

  delete: async (id: number): Promise<void> => {
    await http.delete(`/api/MissingStorage/${id}`).catch(fail(`Failed to delete missing medication storage ${id}`));
  },

  getCount: async (): Promise<number> => {
    const { data } = await http.get("/api/MissingStorage/count").catch(fail("Failed to load missing medication storage count"));
    return z.number().parse(data);
  },
};
