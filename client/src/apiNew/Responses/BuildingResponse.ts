import { z } from 'zod';


export interface  BuildingResponse
{
    Id : number;
    Name : string;
    Address : string | null;
}
export const BuildingResponseSchema = z.object({
    Id: z.int32(),
    Name: z.string().min(2).max(100),
    Address: z.string().min(2).max(255).nullable(),
})