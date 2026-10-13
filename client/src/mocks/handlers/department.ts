import { createMswHandlers } from "../../api/msw.gen";
import { mockDepartment, mockDepartments } from "../fixtures/department";

const { pick } = createMswHandlers();

export const departmentHandlers = [
    pick.departmentGetAllDepartments({ body: mockDepartments }),
    pick.departmentGet({ body: mockDepartment }),
    pick.departmentPost({ body: 100 }),
    pick.departmentPut({ body: null }),
    pick.departmentDelete({ body: null }),
];
