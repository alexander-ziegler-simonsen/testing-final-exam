import { z } from 'zod';

export interface  FloorResponse
{
    id:  number; 
    name:  string | null; 
    fkBuildingId:  number; 
}
export const FloorResponseSchema = z.object({
    id: z.int32(),
    name: z.string().min(2).max(100).nullable(),
    fkBuildingId: z.int32(),
})