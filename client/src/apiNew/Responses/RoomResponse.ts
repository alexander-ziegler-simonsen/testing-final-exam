import { z } from 'zod';


export interface  RoomResponse
{
    Id : number; 

    Name : string;

    FkFloorId : number; 
}
export const RoomResponseSchema = z.object({
    
})