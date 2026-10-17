import { http, HttpResponse } from "msw";
import { mockFloorRoomsResponses } from "../fixtures/responses/FloorRoomsFixture";
import { mockLocationResponses } from "../fixtures/responses/LocationFixture";

// a create answers with the id the new row would get
const NEW_FLOOR_ID = mockFloorRoomsResponses.length + 1;

// a location is looked up by its building id
const findLocation = (id: unknown) => mockLocationResponses.find((location) => location.building.id === Number(id));
const findFloorRooms = (id: unknown) => mockFloorRoomsResponses.find((floorRooms) => floorRooms.floor.id === Number(id));

// the /floor routes must be registered before /:id, otherwise "floor" is matched as an id
export const locationHandlers = [
  http.get("*/api/Location/floor", () => {
    return HttpResponse.json(mockFloorRoomsResponses);
  }),

  http.get("*/api/Location/floor/:id", ({ params }) => {
    const floorRooms = findFloorRooms(params.id);

    if (floorRooms) {
      return HttpResponse.json(floorRooms);
    }
    return HttpResponse.json({ message: "Floor not found" }, { status: 404 });
  }),

  http.post("*/api/Location/floor", () => {
    return HttpResponse.json(NEW_FLOOR_ID);
  }),

  http.put("*/api/Location/floor/:id", ({ params }) => {
    if (findFloorRooms(params.id)) {
      return new HttpResponse(null, { status: 204 });
    }
    return HttpResponse.json({ message: "Floor not found" }, { status: 404 });
  }),

  http.delete("*/api/Location/floor/:id", ({ params }) => {
    if (findFloorRooms(params.id)) {
      return new HttpResponse(null, { status: 204 });
    }
    return HttpResponse.json({ message: "Floor not found" }, { status: 404 });
  }),

  http.get("*/api/Location", () => {
    return HttpResponse.json(mockLocationResponses);
  }),

  http.get("*/api/Location/:id", ({ params }) => {
    const location = findLocation(params.id);

    if (location) {
      return HttpResponse.json(location);
    }
    return HttpResponse.json({ message: "Location not found" }, { status: 404 });
  }),
];
