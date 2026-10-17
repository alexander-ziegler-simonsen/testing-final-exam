import { z } from "zod";
import { fail, http } from "../client";
import { type PrescriptionRequest, PrescriptionRequestSchema } from "../Requests/PrescriptionRequest";
import { type PrescriptionResponse, PrescriptionResponseSchema } from "../Responses/PrescriptionResponse";

export const PrescriptionService = {
  getAll: async (): Promise<PrescriptionResponse[]> => {
    const { data } = await http.get("/api/Prescription").catch(fail("Failed to load prescriptions"));
    return z.array(PrescriptionResponseSchema).parse(data);
  },

  getById: async (id: number): Promise<PrescriptionResponse> => {
    const { data } = await http.get(`/api/Prescription/${id}`).catch(fail(`Failed to load prescription ${id}`));
    return PrescriptionResponseSchema.parse(data);
  },

  create: async (newPrescription: PrescriptionRequest): Promise<number> => {
    const body = PrescriptionRequestSchema.parse(newPrescription);
    const { data } = await http.post("/api/Prescription", body).catch(fail("Failed to create prescription"));
    // the api answers 204 No Content (no id) when nothing was created
    if (typeof data !== "number") throw new Error("Failed to create prescription");
    return data;
  },

  update: async (id: number, changedPrescription: PrescriptionRequest): Promise<void> => {
    const body = PrescriptionRequestSchema.parse(changedPrescription);
    await http.put(`/api/Prescription/${id}`, body).catch(fail(`Failed to update prescription ${id}`));
  },

  delete: async (id: number): Promise<void> => {
    await http.delete(`/api/Prescription/${id}`).catch(fail(`Failed to delete prescription ${id}`));
  },
};
