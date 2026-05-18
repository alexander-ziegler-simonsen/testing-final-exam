import { createCrudService } from "./crudService"
import type { Staff } from "../entites/Staff"

export type StaffInput = Omit<Staff, "id">
export const staffService = createCrudService<Staff>("/staff")
