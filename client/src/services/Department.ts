// src/services/departmentService.ts
import {
    departmentGetAllDepartments,
    departmentGet,
    departmentPost,
    departmentPut,
    departmentDelete,
} from '../api';
import {
    zHospitalApiDtosInputsDepartmentInputDto,
} from '../api/zod.gen';
import type {
    HospitalApiDtosOutputsDepartmentOutputDto,
    HospitalApiDtosInputsDepartmentInputDto,
} from '../api';

export const DepartmentService = {
    getAll: async (): Promise<HospitalApiDtosOutputsDepartmentOutputDto[]> => {
        const { data, error } = await departmentGetAllDepartments();
        if (error) throw new Error('Failed to load departments');
        return data;
    },

    getById: async (id: number): Promise<HospitalApiDtosOutputsDepartmentOutputDto> => {
        const { data, error } = await departmentGet({ path: { id } });
        if (error) throw new Error(`Failed to load department ${id}`);
        return data;
    },

    create: async (newDepartment: HospitalApiDtosInputsDepartmentInputDto): Promise<number> => {
        const body = zHospitalApiDtosInputsDepartmentInputDto.parse(newDepartment);
        const { data, error } = await departmentPost({ body });
        if (error) throw new Error('Failed to create department');
        if (typeof data !== 'number') throw new Error('Failed to create department');
        return data;
    },

    update: async (id: number, changedDepartment: HospitalApiDtosInputsDepartmentInputDto): Promise<void> => {
        const body = zHospitalApiDtosInputsDepartmentInputDto.parse(changedDepartment);
        const { error } = await departmentPut({ path: { id }, body });
        if (error) throw new Error(`Failed to update department ${id}`);
    },

    delete: async (id: number): Promise<void> => {
        const { error } = await departmentDelete({ path: { id } });
        if (error) throw new Error(`Failed to delete department ${id}`);
    },
};