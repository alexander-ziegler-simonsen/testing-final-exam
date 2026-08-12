import { describe, expect, it } from "vitest";
import { DepartmentService } from "./Department";
import { mockDepartment } from "../mocks/fixtures";

describe("DepartmentService", () => {
    it("getAll returns the mocked department list", async () => {
        const departments = await DepartmentService.getAll();
        expect(departments).toContainEqual(mockDepartment);
    });

    it("getById returns a single mocked department", async () => {
        const department = await DepartmentService.getById(mockDepartment.id!);
        expect(department).toEqual(mockDepartment);
    });

    it("create throws when the department name fails validation", async () => {
        await expect(
            DepartmentService.create({ name: "A", type: "Medical" }),
        ).rejects.toThrow();
    });
});
