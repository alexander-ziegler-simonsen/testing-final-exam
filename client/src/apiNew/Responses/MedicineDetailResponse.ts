import { z } from "zod";

export interface MedicineDetailResponse {
  navn: string | null;
  varenummer: string | null;
  styrke: string | null;
  pakning: string | null;
  virksomtStof: string | null;
  firma: string | null;
  atcKode: string | null;
  dosisdispensering: boolean;
  udleveringsgruppe: string | null;
  prisPrPakning: string | null;
  prisPrEnhed: string | null;
  aip: string | null;
  tilskudBeregnesAf: string | null;
  udgaaet: boolean;
  udgaaetDato: string | null;
  dosering: string | null;
  indikation: string | null;
  trafikAdvarsel: boolean;
  ddd: string | null;
  opbevaringsbetingelser: string | null;
  nbsSpeciale: string | null;
  haandkoeb: boolean;
  tilskudKode: string | null;
  tilskudTekst: string | null;
}
export const MedicineDetailResponseSchema = z.object({
  navn: z.string().nullable(),
  varenummer: z.string().nullable(),
  styrke: z.string().nullable(),
  pakning: z.string().nullable(),
  virksomtStof: z.string().nullable(),
  firma: z.string().nullable(),
  atcKode: z.string().nullable(),
  dosisdispensering: z.boolean(),
  udleveringsgruppe: z.string().nullable(),
  prisPrPakning: z.string().nullable(),
  prisPrEnhed: z.string().nullable(),
  aip: z.string().nullable(),
  tilskudBeregnesAf: z.string().nullable(),
  udgaaet: z.boolean(),
  udgaaetDato: z.string().nullable(),
  dosering: z.string().nullable(),
  indikation: z.string().nullable(),
  trafikAdvarsel: z.boolean(),
  ddd: z.string().nullable(),
  opbevaringsbetingelser: z.string().nullable(),
  nbsSpeciale: z.string().nullable(),
  haandkoeb: z.boolean(),
  tilskudKode: z.string().nullable(),
  tilskudTekst: z.string().nullable(),
});
