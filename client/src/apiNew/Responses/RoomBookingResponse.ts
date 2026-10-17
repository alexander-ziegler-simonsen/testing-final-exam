import { z } from 'zod';


export interface  RoomBookingResponse
{
    Id : number; 

    FkRoomId : number; 

    StartTime : Date; 

    EndTime : Date; 

    FkPatientId : number; 
}
export const RoomBookingResponseSchema = z.object({
    Id: z.int32(),
    FkRoomId: z.int32(),
    StartTime: z.iso.datetime({ offset: true, local: true }).transform((s) => new Date(s)),
    EndTime: z.iso.datetime({ offset: true, local: true }).transform((s) => new Date(s)),
    FkPatientId: z.int32(),
})