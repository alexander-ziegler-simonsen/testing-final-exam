import { z } from 'zod';


export interface  BuildingResponse
{
    id : number;
    name : string;
    address : string | null;
}
export const BuildingResponseSchema = z.object({
    id: z.int32(),
    name: z.string().min(2).max(100),
    address: z.string().min(2).max(255).nullable(),
})