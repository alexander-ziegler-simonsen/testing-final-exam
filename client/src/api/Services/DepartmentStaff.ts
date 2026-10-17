import { z } from "zod";
import { fail, http } from "../client";
import { type DepartmentStaffRequest, DepartmentStaffRequestSchema } from "../Requests/DepartmentStaffRequest";
import { type DepartmentStaffResponse, DepartmentStaffResponseSchema } from "../Responses/DepartmentStaffResponse";

export const DepartmentStaffService = {
  getAll: async (): Promise<DepartmentStaffResponse[]> => {
    const { data } = await http.get("/api/DepartmentStaff").catch(fail("Failed to load department staff"));
    return z.array(DepartmentStaffResponseSchema).parse(data);
  },

  getById: async (id: number): Promise<DepartmentStaffResponse> => {
    const { data } = await http.get(`/api/DepartmentStaff/${id}`).catch(fail(`Failed to load department staff ${id}`));
    return DepartmentStaffResponseSchema.parse(data);
  },

  create: async (newDepartmentStaff: DepartmentStaffRequest): Promise<number> => {
    const body = DepartmentStaffRequestSchema.parse(newDepartmentStaff);
    const { data } = await http.post("/api/DepartmentStaff", body).catch(fail("Failed to create department staff"));
    // the api answers 204 No Content (no id) when nothing was created
    if (typeof data !== "number") throw new Error("Failed to create department staff");
    return data;
  },

  update: async (id: number, changedDepartmentStaff: DepartmentStaffRequest): Promise<void> => {
    const body = DepartmentStaffRequestSchema.parse(changedDepartmentStaff);
    await http.put(`/api/DepartmentStaff/${id}`, body).catch(fail(`Failed to update department staff ${id}`));
  },

  delete: async (id: number): Promise<void> => {
    await http.delete(`/api/DepartmentStaff/${id}`).catch(fail(`Failed to delete department staff ${id}`));
  },
};
