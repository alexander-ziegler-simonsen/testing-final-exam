import { z } from 'zod';

export interface FloorIRequest
{
    Name: string;
    FkBuildingId: number;
}
export const FloorIRequestSchema = z.object({

})
