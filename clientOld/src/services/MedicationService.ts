import { createCrudService } from "./crudService"
import type { Medication } from "../entites/Medication"

export type MedicationInput = Omit<Medication, "id">
export const medicationService = createCrudService<Medication>("/medicin")
