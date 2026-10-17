import type { BuildingResponse } from "../../../api/Responses/BuildingResponse";

export const mockBuildingResponse: BuildingResponse = { id: 1, name: "Main Building", address: "Hospitalsvej 1, 2100 København Ø" };

export const mockBuildingResponses: BuildingResponse[] = [
    mockBuildingResponse,
    { id: 2, name: "North Wing", address: "Hospitalsvej 3, 2100 København Ø" },
    { id: 3, name: "Research Center", address: "Forskervej 12, 2200 København N" },
];

// one entry per nullable field, with only that field set to null
export const mockBuildingResponsesWithNulls: BuildingResponse[] = [
    { ...mockBuildingResponse, id: 11, address: null },
];
