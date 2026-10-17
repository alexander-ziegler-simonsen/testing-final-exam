import { z } from 'zod';

export interface  BuildingRequest
{
    Name: string;
    Address: string | null;
}
export const BuildingRequestSchema = z.object({
    Name: z.string().min(2).max(100),
    Address: z.string().min(2).max(255).nullable(),
})
