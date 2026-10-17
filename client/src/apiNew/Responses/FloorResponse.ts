import { z } from 'zod';

export interface  FloorResponse
{
    Id:  number; 
    Name:  string | null; 
    FkBuildingId:  number; 
}
export const FloorResponseSchema = z.object({
    Id: z.int32(),
    Name: z.string().min(2).max(100).nullable(),
    FkBuildingId: z.int32(),
})