import type { FloorIRequest } from "../../../api/Requests/FloorIRequest";

export const mockFloorRequest: FloorIRequest = { name: "Ground Floor", fkBuildingId: 1 };

export const mockFloorRequests: FloorIRequest[] = [
    mockFloorRequest,
    { name: "First Floor", fkBuildingId: 1 },
    { name: "Ground Floor", fkBuildingId: 2 },
];
