import { z } from 'zod';


export interface RoomBookingRequest
{
    fkRoomId: number;
    startTime: Date;
    endTime: Date;
    fkPatientId: number;
}
export const RoomBookingRequestSchema = z.object({
    fkRoomId: z.int32(),
    startTime: z.date(),
    endTime: z.date(),
    fkPatientId: z.int32(),
})