import { HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import {
    handleRoomBookingDelete,
    handleRoomBookingGet,
    handleRoomBookingGetAll,
    handleRoomBookingPost,
    handleRoomBookingPut,
} from "../api/msw.gen";
import { mockRoomBooking, mockRoomBookings } from "../mocks/fixtures";
import { server } from "../mocks/Server";
import { RoomBookingService } from "./RoomBooking";

const validInput = {
    fkRoomId: 14,
    startTime: "2026-08-04T08:30:00Z",
    endTime: "2026-08-04T09:00:00Z",
    fkPatientId: 42,
};

describe("RoomBookingService", () => {
    it("getAll returns the mocked room booking list", async () => {
        const bookings = await RoomBookingService.getAll();
        expect(bookings).toEqual(mockRoomBookings);
    });

    it("getAll throws when the API errors", async () => {
        server.use(
            handleRoomBookingGetAll(() =>
                HttpResponse.json({ title: "Internal Server Error" }, { status: 500 }),
            ),
        );

        await expect(RoomBookingService.getAll()).rejects.toThrow("Failed to load room bookings");
    });

    it("getById returns a single mocked room booking", async () => {
        const booking = await RoomBookingService.getById(mockRoomBooking.id!);
        expect(booking).toEqual(mockRoomBooking);
    });

    it("getById throws when the room booking is missing", async () => {
        server.use(
            handleRoomBookingGet(() => HttpResponse.json({ title: "Not Found" }, { status: 404 })),
        );

        await expect(RoomBookingService.getById(999)).rejects.toThrow("Failed to load room booking 999");
    });

    it("create posts the input and returns the new id", async () => {
        const newId = await RoomBookingService.create(validInput);
        expect(newId).toBe(100);
    });

    // RoomBookingService.create does `throw new Error(error)`, passing the raw
    // parsed error body instead of a string. When the API returns a JSON error
    // body, `new Error()` stringifies it via its default Object.prototype.toString,
    // producing an unhelpful "[object Object]" message rather than surfacing the
    // API's actual error - this test pins down that (undesirable) current behavior.
    it("create's error message becomes '[object Object]' when the API returns a JSON error body", async () => {
        server.use(
            handleRoomBookingPost(() =>
                HttpResponse.json({ title: "Room already booked" }, { status: 409 }),
            ),
        );

        await expect(RoomBookingService.create(validInput)).rejects.toThrow("[object Object]");
    });

    it("create surfaces a plain-text error body as-is", async () => {
        server.use(handleRoomBookingPost(() => new Response("Room already booked", { status: 409 })));

        await expect(RoomBookingService.create(validInput)).rejects.toThrow("Room already booked");
    });

    it("create throws when the API returns a non-number id", async () => {
        server.use(handleRoomBookingPost(() => HttpResponse.json(null, { status: 200 })));

        await expect(RoomBookingService.create(validInput)).rejects.toThrow("Failed to create room booking");
    });

    it("update resolves without throwing on success", async () => {
        await expect(RoomBookingService.update(mockRoomBooking.id!, validInput)).resolves.toBeUndefined();
    });

    // Unlike create, update's ternary only uses the raw error as the message
    // when it happens to already be a string - a JSON error body falls through
    // to the generic fallback message instead.
    it("update falls back to a generic message when the API returns a JSON error body", async () => {
        server.use(
            handleRoomBookingPut(() =>
                HttpResponse.json({ title: "Room already booked" }, { status: 409 }),
            ),
        );

        await expect(RoomBookingService.update(mockRoomBooking.id!, validInput)).rejects.toThrow(
            `Failed to update room booking ${mockRoomBooking.id}`,
        );
    });

    it("update surfaces a plain-text error body as-is", async () => {
        server.use(handleRoomBookingPut(() => new Response("Room already booked", { status: 409 })));

        await expect(RoomBookingService.update(mockRoomBooking.id!, validInput)).rejects.toThrow(
            "Room already booked",
        );
    });

    it("delete resolves without throwing on success", async () => {
        await expect(RoomBookingService.delete(mockRoomBooking.id!)).resolves.toBeUndefined();
    });

    it("delete throws when the API errors", async () => {
        server.use(
            handleRoomBookingDelete(() =>
                HttpResponse.json({ title: "Internal Server Error" }, { status: 500 }),
            ),
        );

        await expect(RoomBookingService.delete(mockRoomBooking.id!)).rejects.toThrow(
            `Failed to delete room booking ${mockRoomBooking.id}`,
        );
    });
});
