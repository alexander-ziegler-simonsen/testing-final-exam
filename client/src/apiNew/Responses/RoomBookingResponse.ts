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
    
})