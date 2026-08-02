import {
    prescriptionGetAllPrescriptions,
    prescriptionGet,
    prescriptionPost,
    prescriptionPut,
    prescriptionDelete,
} from '../api';
import {
    zHospitalApiDtosInputsPrescriptionInputDto,
} from '../api/zod.gen';
import type {
    HospitalApiDtosOutputsPrescriptionOutputDto,
    HospitalApiDtosInputsPrescriptionInputDto,
} from '../api';

export const PrescriptionService = {
    getAll: async (): Promise<HospitalApiDtosOutputsPrescriptionOutputDto[]> => {
        const { data, error } = await prescriptionGetAllPrescriptions();
        if (error) throw new Error('Failed to load prescriptions');
        return data;
    },

    getById: async (id: number): Promise<HospitalApiDtosOutputsPrescriptionOutputDto> => {
        const { data, error } = await prescriptionGet({ path: { id } });
        if (error) throw new Error(`Failed to load prescription ${id}`);
        return data;
    },

    create: async (newPrescription: HospitalApiDtosInputsPrescriptionInputDto): Promise<number> => {
        const body = zHospitalApiDtosInputsPrescriptionInputDto.parse(newPrescription);
        const { data, error } = await prescriptionPost({ body });
        if (error) throw new Error('Failed to create prescription');
        if (typeof data !== 'number') throw new Error('Failed to create prescription');
        return data;
    },

    update: async (id: number, changedPrescription: HospitalApiDtosInputsPrescriptionInputDto): Promise<void> => {
        const body = zHospitalApiDtosInputsPrescriptionInputDto.parse(changedPrescription);
        const { error } = await prescriptionPut({ path: { id }, body });
        if (error) throw new Error(`Failed to update prescription ${id}`);
    },

    delete: async (id: number): Promise<void> => {
        const { error } = await prescriptionDelete({ path: { id } });
        if (error) throw new Error(`Failed to delete prescription ${id}`);
    },
};
