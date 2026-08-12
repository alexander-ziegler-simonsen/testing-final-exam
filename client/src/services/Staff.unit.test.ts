import {
    staffGetAllStaffs,
    staffGet,
    staffPost,
    staffPut,
    staffDelete,
} from '../api';
import {
    zHospitalApiDtosInputsStaffInputDto,
} from '../api/zod.gen';
import type {
    HospitalApiDtosOutputsStaffOutputDto,
    HospitalApiDtosInputsStaffInputDto,
} from '../api';

export const StaffService = {
    getAll: async (): Promise<HospitalApiDtosOutputsStaffOutputDto[]> => {
        const { data, error } = await staffGetAllStaffs();
        if (error) throw new Error('Failed to load staff');
        return data;
    },

    getById: async (id: number): Promise<HospitalApiDtosOutputsStaffOutputDto> => {
        const { data, error } = await staffGet({ path: { id } });
        if (error) throw new Error(`Failed to load staff ${id}`);
        return data;
    },

    create: async (newStaff: HospitalApiDtosInputsStaffInputDto): Promise<number> => {
        const body = zHospitalApiDtosInputsStaffInputDto.parse(newStaff);
        const { data, error } = await staffPost({ body });
        if (error) throw new Error('Failed to create staff');
        if (typeof data !== 'number') throw new Error('Failed to create staff');
        return data;
    },

    update: async (id: number, changedStaff: HospitalApiDtosInputsStaffInputDto): Promise<void> => {
        const body = zHospitalApiDtosInputsStaffInputDto.parse(changedStaff);
        const { error } = await staffPut({ path: { id }, body });
        if (error) throw new Error(`Failed to update staff ${id}`);
    },

    delete: async (id: number): Promise<void> => {
        const { error } = await staffDelete({ path: { id } });
        if (error) throw new Error(`Failed to delete staff ${id}`);
    },
};
