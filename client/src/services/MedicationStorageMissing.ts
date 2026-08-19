import { missingStorageGetAllMedicationStorageMissings, missingStorageGet, missingStoragePost, missingStoragePut, missingStorageDelete, missingStorageGetMissingCount } from "../api";
import { zHospitalApiDtosInputsMedicationStorageMissingInputDto } from "../api/zod.gen";
import type { HospitalApiDtosOutputsMedicationStorageMissingOutputDto, HospitalApiDtosInputsMedicationStorageMissingInputDto } from "../api";

export const MedicationStorageMissingService = {
  getAll: async (): Promise<HospitalApiDtosOutputsMedicationStorageMissingOutputDto[]> => {
    const { data, error } = await missingStorageGetAllMedicationStorageMissings();
    if (error) throw new Error("Failed to load missing medication storages");
    return data;
  },

  getById: async (id: number): Promise<HospitalApiDtosOutputsMedicationStorageMissingOutputDto> => {
    const { data, error } = await missingStorageGet({ path: { id } });
    if (error) throw new Error(`Failed to load missing medication storage ${id}`);
    return data;
  },

  create: async (newMedicationStorageMissing: HospitalApiDtosInputsMedicationStorageMissingInputDto): Promise<number> => {
    const body = zHospitalApiDtosInputsMedicationStorageMissingInputDto.parse(newMedicationStorageMissing);
    const { data, error } = await missingStoragePost({ body });
    if (error) throw new Error("Failed to create missing medication storage");
    if (typeof data !== "number") throw new Error("Failed to create missing medication storage");
    return data;
  },

  update: async (id: number, changedMedicationStorageMissing: HospitalApiDtosInputsMedicationStorageMissingInputDto): Promise<void> => {
    const body = zHospitalApiDtosInputsMedicationStorageMissingInputDto.parse(changedMedicationStorageMissing);
    const { error } = await missingStoragePut({ path: { id }, body });
    if (error) throw new Error(`Failed to update missing medication storage ${id}`);
  },

  delete: async (id: number): Promise<void> => {
    const { error } = await missingStorageDelete({ path: { id } });
    if (error) throw new Error(`Failed to delete missing medication storage ${id}`);
  },

  getCount: async (): Promise<number> => {
    const { data, error } = await missingStorageGetMissingCount();
    if (error) throw new Error("Failed to load missing medication storage count");
    return data;
  },
};
