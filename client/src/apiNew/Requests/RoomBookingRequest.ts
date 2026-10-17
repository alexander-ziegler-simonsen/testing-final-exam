import { z } from 'zod';


export interface RoomBookingRequest
{
    FkRoomId: number;
    StartTime: Date;
    EndTime: Date;
    FkPatientId: number;
}
export const RoomBookingRequestSchema = z.object({
    FkRoomId: z.int32(),
    StartTime: z.date(),
    EndTime: z.date(),
    FkPatientId: z.int32(),
})