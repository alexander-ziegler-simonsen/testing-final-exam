import { z } from "zod";

export interface RoomBookingResponse {
  id: number;
  fkRoomId: number;
  startTime: Date;
  endTime: Date;
  fkPatientId: number;
}
export const RoomBookingResponseSchema = z.object({
  id: z.int32(),
  fkRoomId: z.int32(),
  startTime: z.iso.datetime({ offset: true, local: true }).transform((s) => new Date(s)),
  endTime: z.iso.datetime({ offset: true, local: true }).transform((s) => new Date(s)),
  fkPatientId: z.int32(),
});
