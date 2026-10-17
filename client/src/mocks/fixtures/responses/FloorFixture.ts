import type { FloorResponse } from "../../../api/Responses/FloorResponse";

export const mockFloorResponse: FloorResponse = { id: 1, name: "Ground Floor", fkBuildingId: 1 };

export const mockFloorResponses: FloorResponse[] = [
    mockFloorResponse,
    { id: 2, name: "First Floor", fkBuildingId: 1 },
    { id: 3, name: "Ground Floor", fkBuildingId: 2 },
];

// one entry per nullable field, with only that field set to null
export const mockFloorResponsesWithNulls: FloorResponse[] = [
    { ...mockFloorResponse, id: 11, name: null },
];
