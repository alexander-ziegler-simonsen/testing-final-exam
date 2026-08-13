import { describe, expect, it } from "vitest";
import { handleTreatmentStaffGet, handleTreatmentStaffGetAll } from "../api/msw.gen";
import { mockDepartment, mockDepartmentStaff, mockDepartmentStaffs } from "../mocks/fixtures";
import { server } from "../mocks/Server";
import { DepartmentStaffService } from "./DepartmentStaff";

describe("DepartmentStaffService", () => {
    it("getAll returns the mocked department staff list", async () => {
        server.use(handleTreatmentStaffGetAll({ body: mockDepartmentStaffs }));
        const departmentStaffs = await DepartmentStaffService.getAll();
        expect(departmentStaffs).toEqual(mockDepartmentStaffs);
    });

    it("getById returns a single mocked department staff", async () => {
        server.use(handleTreatmentStaffGet({ body: mockDepartmentStaff }));
        const departmentStaff = await DepartmentStaffService.getById(mockDepartment.id!);
        expect(departmentStaff).toEqual(mockDepartmentStaff);
    });
});
