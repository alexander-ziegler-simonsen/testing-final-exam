import { z } from 'zod';

export interface FloorIRequest
{
    name: string;
    fkBuildingId: number;
}
export const FloorIRequestSchema = z.object({
    name: z.string().min(2).max(100),
    fkBuildingId: z.int32(),
})
