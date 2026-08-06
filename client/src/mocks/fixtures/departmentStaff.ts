import type { HospitalApiDtosOutputsDepartmentStaffOutputDto } from "../../api";
import { mockDepartment, mockDepartments } from "./department";
import { mockStaff, mockStaffs } from "./staff";

export const mockDepartmentStaff: HospitalApiDtosOutputsDepartmentStaffOutputDto = {
    id: 1,
    department: mockDepartment,
    staff: mockStaff,
};

export const mockDepartmentStaffs: HospitalApiDtosOutputsDepartmentStaffOutputDto[] = [
    mockDepartmentStaff,
    { id: 2, department: mockDepartments[1], staff: mockStaffs[1] },
    { id: 3, department: mockDepartments[2], staff: mockStaffs[2] },
];
