import { HttpResponse } from "msw";
import { createMswHandlers } from "../../api/msw.gen";
import { mockFloorRooms, mockLocation, mockLocations } from "../fixtures/location";

const { pick } = createMswHandlers();

// The /floor routes must be registered before /:id, otherwise "floor" is matched as an id.
export const locationHandlers = [
    pick.locationGetAllFloors({ body: mockLocation.floorsWithRooms }),
    pick.locationGetFloor({ body: mockFloorRooms }),
    pick.locationPostFloor({ body: 100 }),
    pick.locationPutFloor(() => new HttpResponse(null, { status: 204 })),
    pick.locationDeleteFloor({ body: null }),

    pick.locationGetAllLocations({ body: mockLocations }),
    pick.locationGet({ body: mockLocation }),
];
