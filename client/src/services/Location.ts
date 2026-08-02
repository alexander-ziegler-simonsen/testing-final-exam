import {
locationGetAllLocations,
locationGet,
locationGetAllFloors,
locationPostFloor,
locationDeleteFloor,
locationGetFloor,
locationPutFloor,
} from '../api';
// import {
// zLocationGetAllLocationsData,
// zLocationGetAllFloorsData,
// zLocationGetFloorData,
// zLocationGetResponses,
// zLocationGetErrors,
// zLocationGetAllFloorsResponses,
// zLocationGetAllFloorsErrors,
// zLocationPostFloorResponses,
// zLocationDeleteFloorResponses,
// zLocationGetFloorResponses,
// zLocationGetFloorErrors,
// zLocationPutFloorResponses,
// } from '../api/zod.gen';
import type {
LocationGetAllLocationsData,
LocationGetAllFloorsData,
LocationGetFloorData,
LocationGetResponses,
LocationGetErrors,
LocationGetAllFloorsResponses,
LocationGetAllFloorsErrors,
LocationPostFloorResponses,
LocationDeleteFloorResponses,
LocationGetFloorResponses,
LocationGetFloorErrors,
LocationPutFloorResponses,
} from '../api';

const basePath = "/Location";

export const LocationService = {
    getAll: async () : Promise<dto[]> =>
    {
        const { data, error } = await locationGetAllLocations();
        if (error) throw new Error("error message");
        return data; 
    },


    getById: async (id: number) : Promise<dto[]> =>
    {
        const { data, error } = await locationGet(id);
        if (error) throw new Error("error message");
        return data; 
    },


    getAllFloorRooms: async () : Promise<dto[]> =>
    {
        const { data, error } = await locationGetAllFloors();
        if (error) throw new Error("error message");
        return data; 
    },


    getOneFloorRooms: async (id: number) : Promise<dto[]> =>
    {
        const { data, error } = await endpoint();
        if (error) throw new Error("error message");
        return data; 
    },


    putFloor: async (id: number, changedFloor: Floor) : Promise<dto[]> =>
    {
        const { data, error } = await endpoint();
        if (error) throw new Error("error message");
        return data; 
    },
        api.post<Floor>(`${basePath}/floor/${id}`, changedFloor)
            .then(r => r.data),

    createFloor: async (newFloor: Floor) : Promise<dto[]> =>
    {
        const { data, error } = await locationPostFloor(newFloor);
        if (error) throw new Error("error message");
        return data; 
    },


    deleteFloor: async (id: number) : Promise<dto[]> =>
    {
        const { data, error } = await endpoint();
        if (error) throw new Error("error message");
        return data; 
    },


    put: async (id: number, changedLocation: Location) : Promise<dto[]> =>
    {
        const { data, error } = await endpoint();
        if (error) throw new Error("error message");
        return data; 
    },


    delete: async (id: number) : Promise<dto[]> =>
    {
        const { data, error } = await endpoint();
        if (error) throw new Error("error message");
        return data; 
    },

}