import { createCrudService } from "./crudService"
import type { Department } from "../entites/Department"

export type DepartmentInput = Omit<Department, "id">
export const departmentService = createCrudService<Department>("/department")
