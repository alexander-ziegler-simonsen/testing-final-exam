import type { BuildingRequest } from "../../../api/Requests/BuildingRequest";

export const mockBuildingRequest: BuildingRequest = { name: "Main Building", address: "Hospitalsvej 1, 2100 København Ø" };

export const mockBuildingRequests: BuildingRequest[] = [
    mockBuildingRequest,
    { name: "North Wing", address: "Hospitalsvej 3, 2100 København Ø" },
    { name: "Research Center", address: "Forskervej 12, 2200 København N" },
];

// one entry per nullable field, with only that field set to null
export const mockBuildingRequestsWithNulls: BuildingRequest[] = [
    { ...mockBuildingRequest, address: null },
];
