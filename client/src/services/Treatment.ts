import { treatmentGetAllTreatments, treatmentGet, treatmentPost, treatmentPut, treatmentDelete } from "../api";
import { zHospitalApiDtosInputsTreatmentInputDto } from "../api/zod.gen";
import type { HospitalApiDtosOutputsTreatmentOutputDto, HospitalApiDtosInputsTreatmentInputDto } from "../api";

export const TreatmentService = {
  getAll: async (filter?: HospitalApiDtosInputsTreatmentInputDto, sortBy?: string, sortDir?: string): Promise<HospitalApiDtosOutputsTreatmentOutputDto[]> => {
    const { data, error } = await treatmentGetAllTreatments({
      query: {
        FkPatientId: filter?.fkPatientId,
        Description: filter?.description ?? undefined,
        Time: filter?.time,
        sortBy,
        sortDir,
      },
    });
    if (error) throw new Error("Failed to load treatments");
    return data;
  },

  getById: async (id: number): Promise<HospitalApiDtosOutputsTreatmentOutputDto> => {
    const { data, error } = await treatmentGet({ path: { id } });
    if (error) throw new Error(`Failed to load treatment ${id}`);
    return data;
  },

  create: async (newTreatment: HospitalApiDtosInputsTreatmentInputDto, staffId?: number | null): Promise<number> => {
    const body = zHospitalApiDtosInputsTreatmentInputDto.parse(newTreatment);
    const { data, error } = await treatmentPost({ body, query: staffId ? { staffId } : undefined });
    if (error) throw new Error("Failed to create treatment");
    if (typeof data !== "number") throw new Error("Failed to create treatment");
    return data;
  },

  update: async (id: number, changedTreatment: HospitalApiDtosInputsTreatmentInputDto): Promise<void> => {
    const body = zHospitalApiDtosInputsTreatmentInputDto.parse(changedTreatment);
    const { error } = await treatmentPut({ path: { id }, body });
    if (error) throw new Error(`Failed to update treatment ${id}`);
  },

  delete: async (id: number): Promise<void> => {
    const { error } = await treatmentDelete({ path: { id } });
    if (error) throw new Error(`Failed to delete treatment ${id}`);
  },
};
