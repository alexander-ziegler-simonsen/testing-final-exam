import { storageGetAllMedicationStorages, storageGet, storagePost, storagePut, storageDelete } from "../api";
import { zHospitalApiDtosInputsMedicationStorageInputDto } from "../api/zod.gen";
import type { HospitalApiDtosOutputsMedicationStorageOutputDto, HospitalApiDtosInputsMedicationStorageInputDto } from "../api";

export const MedicationStorageService = {
  getAll: async (): Promise<HospitalApiDtosOutputsMedicationStorageOutputDto[]> => {
    const { data, error } = await storageGetAllMedicationStorages();
    if (error) throw new Error("Failed to load medication storages");
    return data;
  },

  getById: async (id: number): Promise<HospitalApiDtosOutputsMedicationStorageOutputDto> => {
    const { data, error } = await storageGet({ path: { id } });
    if (error) throw new Error(`Failed to load medication storage ${id}`);
    return data;
  },

  create: async (newMedicationStorage: HospitalApiDtosInputsMedicationStorageInputDto): Promise<number> => {
    const body = zHospitalApiDtosInputsMedicationStorageInputDto.parse(newMedicationStorage);
    const { data, error } = await storagePost({ body });
    if (error) throw new Error("Failed to create medication storage");
    if (typeof data !== "number") throw new Error("Failed to create medication storage");
    return data;
  },

  update: async (id: number, changedMedicationStorage: HospitalApiDtosInputsMedicationStorageInputDto): Promise<void> => {
    const body = zHospitalApiDtosInputsMedicationStorageInputDto.parse(changedMedicationStorage);
    const { error } = await storagePut({ path: { id }, body });
    if (error) throw new Error(`Failed to update medication storage ${id}`);
  },

  delete: async (id: number): Promise<void> => {
    const { error } = await storageDelete({ path: { id } });
    if (error) throw new Error(`Failed to delete medication storage ${id}`);
  },
};
