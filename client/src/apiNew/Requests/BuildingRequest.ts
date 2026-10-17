import { z } from 'zod';

export interface  BuildingRequest
{
    Name: string;
    Address: string | null;
}
export const BuildingRequestSchema = z.object({

})
