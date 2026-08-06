import type {
    HospitalApiDtosOutputsFloorRoomsOutputDto,
    HospitalApiDtosOutputsLocationOutputDto,
} from "../../api";

export const mockFloorRooms: HospitalApiDtosOutputsFloorRoomsOutputDto = {
    floor: { id: 2, name: "2nd floor", fkBuildingId: 1 },
    rooms: [
        { id: 14, name: "Room 201", fkFloorId: 2 },
        { id: 15, name: "Room 202", fkFloorId: 2 },
    ],
};

export const mockLocation: HospitalApiDtosOutputsLocationOutputDto = {
    building: { id: 1, name: "Main Building", address: "Nørrebrogade 44, 8000 Aarhus C" },
    floorsWithRooms: [
        mockFloorRooms,
        {
            floor: { id: 3, name: "3rd floor", fkBuildingId: 1 },
            rooms: [{ id: 21, name: "Room 301", fkFloorId: 3 }],
        },
    ],
};

export const mockLocations: HospitalApiDtosOutputsLocationOutputDto[] = [
    mockLocation,
    {
        building: { id: 2, name: "Annex", address: null },
        floorsWithRooms: [],
    },
];
