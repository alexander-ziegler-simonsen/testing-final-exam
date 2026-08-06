import {
    locationGetAllLocations,
    locationGet,
    locationGetAllFloors,
    locationPostFloor,
    locationDeleteFloor,
    locationGetFloor,
    locationPutFloor,
} from '../api';
import type {
    HospitalApiDtosOutputsLocationOutputDto,
    HospitalApiDtosOutputsFloorRoomsOutputDto,
    HospitalApiDtosInputsFloorInputDto,
} from '../api';
import {
    zHospitalApiDtosInputsFloorInputDto,
} from '../api/zod.gen';

export const LocationService = {
    getAll: async (): Promise<HospitalApiDtosOutputsLocationOutputDto[]> => {
        const { data, error } = await locationGetAllLocations();
        if (error) throw new Error('Failed to load locations');
        return data;
    },

    getById: async (id: number): Promise<HospitalApiDtosOutputsLocationOutputDto> => {
        const { data, error } = await locationGet({ path: { id } });
        if (error) throw new Error(`Failed to load location ${id}`);
        return data;
    },

    getAllFloorRooms: async (): Promise<HospitalApiDtosOutputsFloorRoomsOutputDto[]> => {
        const { data, error } = await locationGetAllFloors();
        if (error) throw new Error('Failed to load floors');
        return data;
    },

    getOneFloorRooms: async (id: number): Promise<HospitalApiDtosOutputsFloorRoomsOutputDto> => {
        const { data, error } = await locationGetFloor({ path: { id } });
        if (error) throw new Error(`Failed to load floor ${id}`);
        return data;
    },

    createFloor: async (newFloor: HospitalApiDtosInputsFloorInputDto): Promise<number> => {
        const body = zHospitalApiDtosInputsFloorInputDto.parse(newFloor);
        const { data, error } = await locationPostFloor({ body });
        if (error) throw new Error('Failed to create floor');
        if (typeof data !== 'number') throw new Error('Failed to create floor');
        return data;
    },

    putFloor: async (id: number, changedFloor: HospitalApiDtosInputsFloorInputDto): Promise<void> => {
        const body = zHospitalApiDtosInputsFloorInputDto.parse(changedFloor);
        const { error } = await locationPutFloor({ path: { id }, body });
        if (error) throw new Error(`Failed to update floor ${id}`);
    },

    deleteFloor: async (id: number): Promise<void> => {
        const { error } = await locationDeleteFloor({ path: { id } });
        if (error) throw new Error(`Failed to delete floor ${id}`);
    },
};