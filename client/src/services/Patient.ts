import {
    patientGetAllPatients,
    patientGet,
    patientPost,
    patientPut,
    patientDelete,
    patientRegisterBaby,
} from '../api';
import {
    zHospitalApiDtosInputsPatientInputDto,
    zHospitalApiDtosInputsRegisterBabyDto,
} from '../api/zod.gen';
import type {
    HospitalApiDtosOutputsPatientOutputDto,
    HospitalApiDtosInputsPatientInputDto,
    HospitalApiDtosInputsRegisterBabyDto,
} from '../api';

export const PatientService = {
    getAll: async (
        filter?: HospitalApiDtosInputsPatientInputDto,
        sortBy?: string,
        sortDir?: string,
    ): Promise<HospitalApiDtosOutputsPatientOutputDto[]> => {
        const { data, error } = await patientGetAllPatients({
            query: {
                Firstname: filter?.firstname ?? undefined,
                Lastname: filter?.lastname ?? undefined,
                Gender: filter?.gender ?? undefined,
                CprNumber: filter?.cprNumber ?? undefined,
                sortBy,
                sortDir,
            },
        });
        if (error) throw new Error('Failed to load patients');
        return data;
    },

    getById: async (id: number): Promise<HospitalApiDtosOutputsPatientOutputDto> => {
        const { data, error } = await patientGet({ path: { id } });
        if (error) throw new Error(`Failed to load patient ${id}`);
        return data;
    },

    create: async (newPatient: HospitalApiDtosInputsPatientInputDto): Promise<number> => {
        const body = zHospitalApiDtosInputsPatientInputDto.parse(newPatient);
        const { data, error } = await patientPost({ body });
        if (error) throw new Error('Failed to create patient');
        if (typeof data !== 'number') throw new Error('Failed to create patient');
        return data;
    },

    update: async (id: number, changedPatient: HospitalApiDtosInputsPatientInputDto): Promise<void> => {
        const body = zHospitalApiDtosInputsPatientInputDto.parse(changedPatient);
        const { error } = await patientPut({ path: { id }, body });
        if (error) throw new Error(`Failed to update patient ${id}`);
    },

    delete: async (id: number): Promise<void> => {
        const { error } = await patientDelete({ path: { id } });
        if (error) throw new Error(`Failed to delete patient ${id}`);
    },

    registerBaby: async (newBaby: HospitalApiDtosInputsRegisterBabyDto): Promise<number> => {
        const body = zHospitalApiDtosInputsRegisterBabyDto.parse(newBaby);
        const { data, error } = await patientRegisterBaby({ body });
        if (error) throw new Error('Failed to register baby');
        if (typeof data !== 'number') throw new Error('Failed to register baby');
        return data;
    },
};
