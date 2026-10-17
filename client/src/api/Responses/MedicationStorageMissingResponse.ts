import { z } from "zod";

export interface MedicationStorageMissingResponse {
  id: number;
  fkMedicationStorageId: number;
  amountMissing: number;
  wentMissingAt: Date;
}
export const MedicationStorageMissingResponseSchema = z.object({
  id: z.int32(),
  fkMedicationStorageId: z.int32(),
  amountMissing: z.number(),
  wentMissingAt: z.iso.datetime({ offset: true, local: true }).transform((s) => new Date(s)),
});
