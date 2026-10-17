import { z } from "zod";
import { fail, http } from "../client";
import { type MedicationStorageRequest, MedicationStorageRequestSchema } from "../Requests/MedicationStorageRequest";
import { type MedicationStorageResponse, MedicationStorageResponseSchema } from "../Responses/MedicationStorageResponse";

export const MedicationStorageService = {
  getAll: async (): Promise<MedicationStorageResponse[]> => {
    const { data } = await http.get("/api/Storage").catch(fail("Failed to load medication storages"));
    return z.array(MedicationStorageResponseSchema).parse(data);
  },

  getById: async (id: number): Promise<MedicationStorageResponse> => {
    const { data } = await http.get(`/api/Storage/${id}`).catch(fail(`Failed to load medication storage ${id}`));
    return MedicationStorageResponseSchema.parse(data);
  },

  create: async (newMedicationStorage: MedicationStorageRequest): Promise<number> => {
    const body = MedicationStorageRequestSchema.parse(newMedicationStorage);
    const { data } = await http.post("/api/Storage", body).catch(fail("Failed to create medication storage"));
    // the api answers 204 No Content (no id) when nothing was created
    if (typeof data !== "number") throw new Error("Failed to create medication storage");
    return data;
  },

  update: async (id: number, changedMedicationStorage: MedicationStorageRequest): Promise<void> => {
    const body = MedicationStorageRequestSchema.parse(changedMedicationStorage);
    await http.put(`/api/Storage/${id}`, body).catch(fail(`Failed to update medication storage ${id}`));
  },

  delete: async (id: number): Promise<void> => {
    await http.delete(`/api/Storage/${id}`).catch(fail(`Failed to delete medication storage ${id}`));
  },
};
