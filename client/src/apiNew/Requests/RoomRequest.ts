import { z } from 'zod';


export interface RoomRequest
{
    name: string;
    fkFloorId: number;
}
export const RoomRequestSchema = z.object({
    name: z.string(),
    fkFloorId: z.int32(),
})