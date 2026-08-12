import { treatmentStaffGetAll, treatmentStaffGet, treatmentStaffPost, treatmentStaffPut, treatmentStaffDelete } from "../api";
import { zHospitalApiDtosInputsTreatmentStaffInputDto } from "../api/zod.gen";
import type { HospitalApiDtosOutputsTreatmentStaffOutputDto, HospitalApiDtosInputsTreatmentStaffInputDto } from "../api";

export const TreatmentStaffService = {
  getAll: async (): Promise<HospitalApiDtosOutputsTreatmentStaffOutputDto[]> => {
    const { data, error } = await treatmentStaffGetAll();
    if (error) throw new Error("Failed to load treatment staff");
    return data;
  },

  getById: async (id: number): Promise<HospitalApiDtosOutputsTreatmentStaffOutputDto> => {
    const { data, error } = await treatmentStaffGet({ path: { id } });
    if (error) throw new Error(`Failed to load treatment staff ${id}`);
    return data;
  },

  create: async (newTreatmentStaff: HospitalApiDtosInputsTreatmentStaffInputDto): Promise<number> => {
    const body = zHospitalApiDtosInputsTreatmentStaffInputDto.parse(newTreatmentStaff);
    const { data, error } = await treatmentStaffPost({ body });
    if (error) throw new Error("Failed to create treatment staff");
    if (typeof data !== "number") throw new Error("Failed to create treatment staff");
    return data;
  },

  update: async (id: number, changedTreatmentStaff: HospitalApiDtosInputsTreatmentStaffInputDto): Promise<void> => {
    const body = zHospitalApiDtosInputsTreatmentStaffInputDto.parse(changedTreatmentStaff);
    const { error } = await treatmentStaffPut({ path: { id }, body });
    if (error) throw new Error(`Failed to update treatment staff ${id}`);
  },

  delete: async (id: number): Promise<void> => {
    const { error } = await treatmentStaffDelete({ path: { id } });
    if (error) throw new Error(`Failed to delete treatment staff ${id}`);
  },
};
