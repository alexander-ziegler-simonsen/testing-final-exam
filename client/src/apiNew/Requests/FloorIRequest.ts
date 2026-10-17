import { z } from 'zod';

export interface FloorIRequest
{
    Name: string;
    FkBuildingId: number;
}
export const FloorIRequestSchema = z.object({
    Name: z.string().min(2).max(100),
    FkBuildingId: z.int32(),
})
