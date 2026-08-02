import {
    medicinGetAllMedicins,
    medicinGet,
    medicinPost,
    medicinPut,
    medicinDelete,
} from '../api';
import {
    zHospitalApiDtosInputsMedicationInputDto,
} from '../api/zod.gen';
import type {
    HospitalApiDtosOutputsMedicationOutputDto,
    HospitalApiDtosInputsMedicationInputDto,
} from '../api';

export const MedicationService = {
    getAll: async (): Promise<HospitalApiDtosOutputsMedicationOutputDto[]> => {
        const { data, error } = await medicinGetAllMedicins();
        if (error) throw new Error('Failed to load medications');
        return data;
    },

    getById: async (id: number): Promise<HospitalApiDtosOutputsMedicationOutputDto> => {
        const { data, error } = await medicinGet({ path: { id } });
        if (error) throw new Error(`Failed to load medication ${id}`);
        return data;
    },

    create: async (newMedication: HospitalApiDtosInputsMedicationInputDto): Promise<number> => {
        const body = zHospitalApiDtosInputsMedicationInputDto.parse(newMedication);
        const { data, error } = await medicinPost({ body });
        if (error) throw new Error('Failed to create medication');
        if (typeof data !== 'number') throw new Error('Failed to create medication');
        return data;
    },

    update: async (id: number, changedMedication: HospitalApiDtosInputsMedicationInputDto): Promise<void> => {
        const body = zHospitalApiDtosInputsMedicationInputDto.parse(changedMedication);
        const { error } = await medicinPut({ path: { id }, body });
        if (error) throw new Error(`Failed to update medication ${id}`);
    },

    delete: async (id: number): Promise<void> => {
        const { error } = await medicinDelete({ path: { id } });
        if (error) throw new Error(`Failed to delete medication ${id}`);
    },
};
