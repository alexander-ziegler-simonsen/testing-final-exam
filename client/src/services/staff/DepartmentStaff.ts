import { departmentStaffGetAll, departmentStaffGet, departmentStaffPost, departmentStaffPut, departmentStaffDelete } from "../api";
import { zHospitalApiDtosInputsDepartmentStaffInputDto } from "../api/zod.gen";
import type { HospitalApiDtosOutputsDepartmentStaffOutputDto, HospitalApiDtosInputsDepartmentStaffInputDto } from "../api";

export const DepartmentStaffService = {
  getAll: async (): Promise<HospitalApiDtosOutputsDepartmentStaffOutputDto[]> => {
    const { data, error } = await departmentStaffGetAll();
    if (error) throw new Error("Failed to load department staff");
    return data;
  },

  getById: async (id: number): Promise<HospitalApiDtosOutputsDepartmentStaffOutputDto> => {
    const { data, error } = await departmentStaffGet({ path: { id } });
    if (error) throw new Error(`Failed to load department staff ${id}`);
    return data;
  },

  create: async (newDepartmentStaff: HospitalApiDtosInputsDepartmentStaffInputDto): Promise<number> => {
    const body = zHospitalApiDtosInputsDepartmentStaffInputDto.parse(newDepartmentStaff);
    const { data, error } = await departmentStaffPost({ body });
    if (error) throw new Error("Failed to create department staff");
    if (typeof data !== "number") throw new Error("Failed to create department staff");
    return data;
  },

  update: async (id: number, changedDepartmentStaff: HospitalApiDtosInputsDepartmentStaffInputDto): Promise<void> => {
    const body = zHospitalApiDtosInputsDepartmentStaffInputDto.parse(changedDepartmentStaff);
    const { error } = await departmentStaffPut({ path: { id }, body });
    if (error) throw new Error(`Failed to update department staff ${id}`);
  },

  delete: async (id: number): Promise<void> => {
    const { error } = await departmentStaffDelete({ path: { id } });
    if (error) throw new Error(`Failed to delete department staff ${id}`);
  },
};
