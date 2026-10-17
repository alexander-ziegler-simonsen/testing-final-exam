import { z } from "zod";
import { fail, http } from "../client";
import { type PatientRequest, PatientRequestSchema } from "../Requests/PatientRequest";
import { type RegisterBabyRequest, RegisterBabyRequestSchema } from "../Requests/RegisterBabyRequest";
import { type PatientResponse, PatientResponseSchema } from "../Responses/PatientResponse";

export const PatientService = {
  getAll: async (filter?: Partial<PatientRequest>, sortBy?: string, sortDir?: string): Promise<PatientResponse[]> => {
    const { data } = await http
      .get("/api/Patient", {
        // axios leaves out params that are null/undefined
        params: {
          Firstname: filter?.firstname,
          Lastname: filter?.lastname,
          Gender: filter?.gender,
          CprNumber: filter?.cprNumber,
          sortBy,
          sortDir,
        },
      })
      .catch(fail("Failed to load patients"));
    return z.array(PatientResponseSchema).parse(data);
  },

  getById: async (id: number): Promise<PatientResponse> => {
    const { data } = await http.get(`/api/Patient/${id}`).catch(fail(`Failed to load patient ${id}`));
    return PatientResponseSchema.parse(data);
  },

  create: async (newPatient: PatientRequest): Promise<number> => {
    const body = PatientRequestSchema.parse(newPatient);
    const { data } = await http.post("/api/Patient", body).catch(fail("Failed to create patient"));
    // the api answers 204 No Content (no id) when nothing was created
    if (typeof data !== "number") throw new Error("Failed to create patient");
    return data;
  },

  update: async (id: number, changedPatient: PatientRequest): Promise<void> => {
    const body = PatientRequestSchema.parse(changedPatient);
    await http.put(`/api/Patient/${id}`, body).catch(fail(`Failed to update patient ${id}`));
  },

  delete: async (id: number): Promise<void> => {
    await http.delete(`/api/Patient/${id}`).catch(fail(`Failed to delete patient ${id}`));
  },

  registerBaby: async (newBaby: RegisterBabyRequest): Promise<number> => {
    const body = RegisterBabyRequestSchema.parse(newBaby);
    const { data } = await http.post("/api/Patient/register-baby", body).catch(fail("Failed to register baby"));
    if (typeof data !== "number") throw new Error("Failed to register baby");
    return data;
  },

  getCount: async (): Promise<number> => {
    const { data } = await http.get("/api/Patient/count").catch(fail("Failed to load patient count"));
    return z.number().parse(data);
  },
};
