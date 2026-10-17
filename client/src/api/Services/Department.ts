import { z } from "zod";
import { fail, http } from "../client";
import { type DepartmentRequest, DepartmentRequestSchema } from "../Requests/DepartmentRequest";
import { type DepartmentResponse, DepartmentResponseSchema } from "../Responses/DepartmentResponse";

export const DepartmentService = {
  getAll: async (): Promise<DepartmentResponse[]> => {
    const { data } = await http.get("/api/Department").catch(fail("Failed to load departments"));
    return z.array(DepartmentResponseSchema).parse(data);
  },

  getById: async (id: number): Promise<DepartmentResponse> => {
    const { data } = await http.get(`/api/Department/${id}`).catch(fail(`Failed to load department ${id}`));
    return DepartmentResponseSchema.parse(data);
  },

  create: async (newDepartment: DepartmentRequest): Promise<number> => {
    const body = DepartmentRequestSchema.parse(newDepartment);
    const { data } = await http.post("/api/Department", body).catch(fail("Failed to create department"));

    if (typeof data !== "number") throw new Error("Failed to create department");
    return data;
  },

  update: async (id: number, changedDepartment: DepartmentRequest): Promise<void> => {
    const body = DepartmentRequestSchema.parse(changedDepartment);
    await http.put(`/api/Department/${id}`, body).catch(fail(`Failed to update department ${id}`));
  },

  delete: async (id: number): Promise<void> => {
    await http.delete(`/api/Department/${id}`).catch(fail(`Failed to delete department ${id}`));
  },
};
