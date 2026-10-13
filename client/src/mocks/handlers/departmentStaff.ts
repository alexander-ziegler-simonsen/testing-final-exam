import { HttpResponse } from "msw";
import { createMswHandlers } from "../../api/msw.gen";
import { mockDepartmentStaff, mockDepartmentStaffs } from "../fixtures/departmentStaff";

const { pick } = createMswHandlers();

export const departmentStaffHandlers = [
    pick.departmentStaffGetAll({ body: mockDepartmentStaffs }),
    pick.departmentStaffGet({ body: mockDepartmentStaff }),
    pick.departmentStaffPost({ body: 100 }),
    pick.departmentStaffPut({ body: null }),
    pick.departmentStaffDelete(() => new HttpResponse(null, { status: 204 })),
];
