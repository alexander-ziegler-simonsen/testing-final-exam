import { z } from 'zod';

export interface  BuildingRequest
{
    name: string;
    address: string | null;
}
export const BuildingRequestSchema = z.object({
    name: z.string().min(2).max(100),
    address: z.string().min(2).max(255).nullable(),
})
