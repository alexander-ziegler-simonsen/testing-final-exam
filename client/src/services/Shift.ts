import {
    shiftGetAllShifts,
    shiftGet,
    shiftPost,
    shiftPut,
    shiftDelete,
} from '../api';
import {
    zHospitalApiDtosInputsShiftInputDto,
} from '../api/zod.gen';
import type {
    HospitalApiDtosOutputsShiftOutputDto,
    HospitalApiDtosInputsShiftInputDto,
} from '../api';

export const ShiftService = {
    getAll: async (
        from?: Date,
        to?: Date,
        sortBy?: string,
        sortDir?: string,
    ): Promise<HospitalApiDtosOutputsShiftOutputDto[]> => {
        const { data, error } = await shiftGetAllShifts({
            query: {
                from: from?.toISOString(),
                to: to?.toISOString(),
                sortBy,
                sortDir,
            },
        });
        if (error) throw new Error('Failed to load shifts');
        return data;
    },

    getById: async (id: number): Promise<HospitalApiDtosOutputsShiftOutputDto> => {
        const { data, error } = await shiftGet({ path: { id } });
        if (error) throw new Error(`Failed to load shift ${id}`);
        return data;
    },

    create: async (newShift: HospitalApiDtosInputsShiftInputDto): Promise<number> => {
        const body = zHospitalApiDtosInputsShiftInputDto.parse(newShift);
        const { data, error } = await shiftPost({ body });
        if (error) throw new Error('Failed to create shift');
        if (typeof data !== 'number') throw new Error('Failed to create shift');
        return data;
    },

    update: async (id: number, changedShift: HospitalApiDtosInputsShiftInputDto): Promise<void> => {
        const body = zHospitalApiDtosInputsShiftInputDto.parse(changedShift);
        const { error } = await shiftPut({ path: { id }, body });
        if (error) throw new Error(`Failed to update shift ${id}`);
    },

    delete: async (id: number): Promise<void> => {
        const { error } = await shiftDelete({ path: { id } });
        if (error) throw new Error(`Failed to delete shift ${id}`);
    },
};
