import type { LocationResponse } from "../../../api/Responses/LocationResponse";
import { mockBuildingResponse, mockBuildingResponses } from "./BuildingFixture";
import { mockFloorRoomsResponses, mockFloorRoomsResponsesWithNulls } from "./FloorRoomsFixture";

const floorsInBuilding = (buildingId: number) =>
    mockFloorRoomsResponses.filter((floorRooms) => floorRooms.floor.fkBuildingId === buildingId);

export const mockLocationResponse: LocationResponse = {
    building: mockBuildingResponse,
    floorsWithRooms: floorsInBuilding(mockBuildingResponse.id),
};

// building 3 has no floors, so its floorsWithRooms array is empty
export const mockLocationResponses: LocationResponse[] = mockBuildingResponses.map((building) => ({
    building,
    floorsWithRooms: floorsInBuilding(building.id),
}));

// the nullable fields live on the nested building and floors - one entry per nullable field
export const mockLocationResponsesWithNulls: LocationResponse[] = [
    { ...mockLocationResponse, building: { ...mockBuildingResponse, address: null } },
    { ...mockLocationResponse, floorsWithRooms: mockFloorRoomsResponsesWithNulls },
];
