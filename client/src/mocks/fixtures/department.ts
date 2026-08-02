import type { HospitalApiDtosOutputsDepartmentOutputDto } from "../../api";

export const mockDepartment: HospitalApiDtosOutputsDepartmentOutputDto = {
    id: 3,
    name: "Cardiology",
    type: "Medical",
};

export const mockDepartments: HospitalApiDtosOutputsDepartmentOutputDto[] = [
    mockDepartment,
    { id: 4, name: "Radiology", type: "Diagnostic" },
    { id: 9, name: "ER", type: null },
];
