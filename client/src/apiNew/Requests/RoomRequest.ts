import { z } from 'zod';


export interface RoomRequest
{
    Name: string;
    FkFloorId: number;
}
export const RoomRequestSchema = z.object({
    Name: z.string(),
    FkFloorId: z.int32(),
})