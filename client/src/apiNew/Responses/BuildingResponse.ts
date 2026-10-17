import { z } from 'zod';


export interface  BuildingResponse
{
    Id : number;
    Name : string;
    Address : string | null;
}
export const BuildingResponseSchema = z.object({
    
})