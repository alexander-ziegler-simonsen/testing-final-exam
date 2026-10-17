import { z } from "zod";
import { fail, http } from "../client";
import { type TreatmentRequest, TreatmentRequestSchema } from "../Requests/TreatmentRequest";
import { type TreatmentResponse, TreatmentResponseSchema } from "../Responses/TreatmentResponse";

export const TreatmentService = {
  getAll: async (filter?: Partial<TreatmentRequest>, sortBy?: string, sortDir?: string): Promise<TreatmentResponse[]> => {
    const { data } = await http
      .get("/api/Treatment", {
        // axios leaves out params that are null/undefined
        params: {
          FkPatientId: filter?.fkPatientId,
          Description: filter?.description,
          Time: filter?.time,
          sortBy,
          sortDir,
        },
      })
      .catch(fail("Failed to load treatments"));
    return z.array(TreatmentResponseSchema).parse(data);
  },

  getById: async (id: number): Promise<TreatmentResponse> => {
    const { data } = await http.get(`/api/Treatment/${id}`).catch(fail(`Failed to load treatment ${id}`));
    return TreatmentResponseSchema.parse(data);
  },

  create: async (newTreatment: TreatmentRequest, staffId?: number | null): Promise<number> => {
    const body = TreatmentRequestSchema.parse(newTreatment);
    const { data } = await http
      .post("/api/Treatment", body, { params: staffId ? { staffId } : undefined })
      .catch(fail("Failed to create treatment"));
    // the api answers 204 No Content (no id) when nothing was created
    if (typeof data !== "number") throw new Error("Failed to create treatment");
    return data;
  },

  update: async (id: number, changedTreatment: TreatmentRequest): Promise<void> => {
    const body = TreatmentRequestSchema.parse(changedTreatment);
    await http.put(`/api/Treatment/${id}`, body).catch(fail(`Failed to update treatment ${id}`));
  },

  delete: async (id: number): Promise<void> => {
    await http.delete(`/api/Treatment/${id}`).catch(fail(`Failed to delete treatment ${id}`));
  },
};
