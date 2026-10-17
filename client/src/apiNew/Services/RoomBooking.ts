import { isAxiosError } from "axios";
import { z } from "zod";
import { fail, http } from "../client";
import { type RoomBookingRequest, RoomBookingRequestSchema } from "../Requests/RoomBookingRequest";
import { type RoomBookingResponse, RoomBookingResponseSchema } from "../Responses/RoomBookingResponse";

// A rejected booking comes back as 409 with a plain string body
// ("Room is already booked for the requested time slot."), which is worth showing as-is.
const failWithServerMessage =
  (fallback: string) =>
  (error: unknown): never => {
    const serverMessage = isAxiosError(error) ? error.response?.data : undefined;
    throw new Error(typeof serverMessage === "string" && serverMessage ? serverMessage : fallback, { cause: error });
  };

export const RoomBookingService = {
  getAll: async (): Promise<RoomBookingResponse[]> => {
    const { data } = await http.get("/api/RoomBooking").catch(fail("Failed to load room bookings"));
    return z.array(RoomBookingResponseSchema).parse(data);
  },

  getById: async (id: number): Promise<RoomBookingResponse> => {
    const { data } = await http.get(`/api/RoomBooking/${id}`).catch(fail(`Failed to load room booking ${id}`));
    return RoomBookingResponseSchema.parse(data);
  },

  create: async (newRoomBooking: RoomBookingRequest): Promise<number> => {
    const body = RoomBookingRequestSchema.parse(newRoomBooking);
    const { data } = await http.post("/api/RoomBooking", body).catch(failWithServerMessage("Failed to create room booking"));
    // the api answers 204 No Content (no id) when nothing was created
    if (typeof data !== "number") throw new Error("Failed to create room booking");
    return data;
  },

  update: async (id: number, changedRoomBooking: RoomBookingRequest): Promise<void> => {
    const body = RoomBookingRequestSchema.parse(changedRoomBooking);
    await http.put(`/api/RoomBooking/${id}`, body).catch(failWithServerMessage(`Failed to update room booking ${id}`));
  },

  delete: async (id: number): Promise<void> => {
    await http.delete(`/api/RoomBooking/${id}`).catch(fail(`Failed to delete room booking ${id}`));
  },

  getEmptyRoomsCountForDay: async (date: string): Promise<number> => {
    const { data } = await http.get("/api/RoomBooking/empty-rooms-count", { params: { date } }).catch(fail("Failed to load empty rooms count"));
    return z.number().parse(data);
  },

  getRoomsInUseCountByFloor: async (floorFkId: number): Promise<number> => {
    const { data } = await http.get("/api/RoomBooking/rooms-in-use-count", { params: { floorFkId } }).catch(fail("Failed to load rooms in use count"));
    return z.number().parse(data);
  },
};
