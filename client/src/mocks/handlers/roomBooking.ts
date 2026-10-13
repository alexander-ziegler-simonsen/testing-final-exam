import { createMswHandlers } from "../../api/msw.gen";
import { mockRoomBooking, mockRoomBookings } from "../fixtures/roomBooking";

const { pick } = createMswHandlers();

// The count routes must be registered before /:id, otherwise they are matched as an id.
export const roomBookingHandlers = [
    pick.roomBookingGetEmptyRoomsCountForDay(),
    pick.roomBookingGetRoomsInUseCountByFloor(),

    pick.roomBookingGetAll({ body: mockRoomBookings }),
    pick.roomBookingGet({ body: mockRoomBooking }),
    pick.roomBookingPost({ body: 100 }),
    pick.roomBookingPut({ body: null, status: 200 }),
    pick.roomBookingDelete({ body: null }),
];
