import { createCrudService } from "./crudService"
import type { TreatmentStaff } from "../entites/TreatmentStaff"

export type TreatmentStaffInput = Omit<TreatmentStaff, "id">
export const treatmentStaffService = createCrudService<TreatmentStaff>("/treatmentstaff")
