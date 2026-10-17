import { z } from 'zod';

export interface  FloorResponse
{
    Id:  number; 
    Name:  string | null; 
    FkBuildingId:  number; 
}
export const FloorResponseSchema = z.object({
    
})