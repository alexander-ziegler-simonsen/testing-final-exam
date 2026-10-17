import { http, HttpResponse } from "msw";
import { mockRoomBookingResponses } from "../fixtures/responses/RoomBookingFixture";
import { mockRoomResponses } from "../fixtures/responses/RoomFixture";

const getParam = (request: Request, name: string) => new URL(request.url).searchParams.get(name);

// a create answers with the id the new row would get
const NEW_ROOM_BOOKING_ID = mockRoomBookingResponses.length + 1;

const ROOM_TAKEN_MESSAGE = "Room is already booked for the requested time slot.";

// wire format of RoomBookingRequest - the dates arrive as ISO strings
type RoomBookingBody = { fkRoomId: number; startTime: string; endTime: string; fkPatientId: number };

const findRoomBooking = (id: unknown) => mockRoomBookingResponses.find((booking) => booking.id === Number(id));

// same rule as the api: a booking for the same room that overlaps the time slot, a booking being edited does not clash with itself
const isRoomTaken = ({ fkRoomId, startTime, endTime }: RoomBookingBody, excludeBookingId?: number) =>
  mockRoomBookingResponses.some((booking) => booking.fkRoomId === fkRoomId && booking.id !== excludeBookingId && new Date(booking.startTime) < new Date(endTime) && new Date(booking.endTime) > new Date(startTime));

const isBookedBetween = (roomId: number, start: Date, end: Date) => mockRoomBookingResponses.some((booking) => booking.fkRoomId === roomId && new Date(booking.startTime) < end && new Date(booking.endTime) > start);

// the count routes must be registered before /:id, otherwise they are matched as an id
export const roomBookingHandlers = [
  // rooms without any booking touching that day (UTC)
  http.get("*/api/RoomBooking/empty-rooms-count", ({ request }) => {
    const dayStart = new Date(`${getParam(request, "date")?.slice(0, 10)}T00:00:00Z`);
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

    return HttpResponse.json(mockRoomResponses.filter((room) => !isBookedBetween(room.id, dayStart, dayEnd)).length);
  }),

  // rooms on that floor with a booking running right now
  http.get("*/api/RoomBooking/rooms-in-use-count", ({ request }) => {
    const floorFkId = Number(getParam(request, "floorFkId"));
    const now = new Date();
    const isInUse = (roomId: number) => mockRoomBookingResponses.some((booking) => booking.fkRoomId === roomId && new Date(booking.startTime) <= now && new Date(booking.endTime) > now);

    return HttpResponse.json(mockRoomResponses.filter((room) => room.fkFloorId === floorFkId && isInUse(room.id)).length);
  }),

  http.get("*/api/RoomBooking", () => {
    return HttpResponse.json(mockRoomBookingResponses);
  }),

  http.get("*/api/RoomBooking/:id", ({ params }) => {
    const booking = findRoomBooking(params.id);

    if (booking) {
      return HttpResponse.json(booking);
    }
    return HttpResponse.json({ message: "Room booking not found" }, { status: 404 });
  }),

  http.post("*/api/RoomBooking", async ({ request }) => {
    const body = (await request.json()) as RoomBookingBody;

    if (isRoomTaken(body)) {
      return HttpResponse.json(ROOM_TAKEN_MESSAGE, { status: 409 });
    }
    return HttpResponse.json(NEW_ROOM_BOOKING_ID);
  }),

  http.put("*/api/RoomBooking/:id", async ({ request, params }) => {
    const body = (await request.json()) as RoomBookingBody;

    if (isRoomTaken(body, Number(params.id))) {
      return HttpResponse.json(ROOM_TAKEN_MESSAGE, { status: 409 });
    }
    if (findRoomBooking(params.id)) {
      return new HttpResponse(null, { status: 200 });
    }
    return HttpResponse.json({ message: "Room booking not found" }, { status: 404 });
  }),

  http.delete("*/api/RoomBooking/:id", ({ params }) => {
    if (findRoomBooking(params.id)) {
      return new HttpResponse(null, { status: 204 });
    }
    return HttpResponse.json({ message: "Room booking not found" }, { status: 404 });
  }),
];
