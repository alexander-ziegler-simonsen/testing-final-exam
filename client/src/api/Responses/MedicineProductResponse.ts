import { z } from "zod";

export interface MedicineProductResponse {
  navn: string;
  varenummer: string;
  firma: string;
  styrke: string;
  detaljer: string;
  pakning: string;
}
export const MedicineProductResponseSchema = z.object({
  navn: z.string(),
  varenummer: z.string(),
  firma: z.string(),
  styrke: z.string(),
  detaljer: z.string(),
  pakning: z.string(),
});
