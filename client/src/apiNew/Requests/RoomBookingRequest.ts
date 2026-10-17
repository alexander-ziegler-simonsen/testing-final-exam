import { z } from 'zod';


export interface RoomBookingRequest
{
    FkRoomId: number;
    StartTime: Date;
    EndTime: Date;
    FkPatientId: number;
}
export const RoomBookingRequestSchema = z.object({
    
})