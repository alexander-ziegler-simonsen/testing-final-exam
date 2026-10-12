import { describe, it } from "vitest";
import { placeholder } from "../test-utils/placeholder";

// Placeholders: each test passes by default until it's implemented.

describe("RoomBookingService", () => {
    it("getAll returns the mocked room booking list", placeholder);
    it("getAll throws when the API errors", placeholder);
    it("getById returns a single mocked room booking", placeholder);
    it("getById throws when the room booking is missing", placeholder);
    it("create posts the input and returns the new id", placeholder);
    it("create throws with the server's message when the room is already booked (409)", placeholder);
    it("create throws a readable message, not \"[object Object]\", when the error is a ProblemDetails body", placeholder);
    it("create throws when the API returns a non-number id", placeholder);
    it("create throws before sending a request when startTime is not an iso datetime", placeholder);
    it("update resolves without throwing on success", placeholder);
    it("update throws with the server's message on a conflict (409)", placeholder);
    it("update throws \"Failed to update room booking <id>\" when the error is not a string (404)", placeholder);
    it("update throws before sending a request when the input fails validation", placeholder);
    it("delete resolves without throwing on success", placeholder);
    it("delete throws when the API errors", placeholder);
    it("getEmptyRoomsCountForDay returns the mocked count", placeholder);
    it("getEmptyRoomsCountForDay sends the date as the date query param", placeholder);
    it("getEmptyRoomsCountForDay throws when the API errors", placeholder);
    it("getRoomsInUseCountByFloor returns the mocked count", placeholder);
    it("getRoomsInUseCountByFloor sends the floor id as the floorFkId query param", placeholder);
    it("getRoomsInUseCountByFloor throws when the API errors", placeholder);
});
