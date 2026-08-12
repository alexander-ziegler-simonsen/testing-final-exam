import { HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { handleDepartmentGet, handleDepartmentGetAllDepartments, handleDepartmentPost } from "../api/msw.gen";
import { mockDepartment, mockDepartments } from "../mocks/fixtures";
import { server } from "../mocks/Server";
import { DepartmentService } from "./Department";

describe("DepartmentService", () => {

  it("getAll returns the mocked department list", async () => {
    server.use(handleDepartmentGetAllDepartments({ body: mockDepartments }));

    const departments = await DepartmentService.getAll();

    expect(departments).toEqual(mockDepartments);
  });

  it("getById returns a single mocked department", async () => {
    server.use(handleDepartmentGet({ body: mockDepartment }));

    const department = await DepartmentService.getById(mockDepartment.id!);

    expect(department).toEqual(mockDepartment);
  });

  it("create posts the input and returns the new id", async () => {
    server.use(handleDepartmentPost({ body: 42 }));

    const newId = await DepartmentService.create({ name: "Neurology", type: "Medical" });

    expect(newId).toBe(42);
  });

  it("create throws when the department name fails validation", async () => {
    const invalidDepartment = { name: "A", type: "Medical" };

    const result = DepartmentService.create(invalidDepartment);

    await expect(result).rejects.toThrow();
  });

  it("getAll throws when the API errors", async () => {
    server.use(handleDepartmentGetAllDepartments(() => HttpResponse.json({ title: "Internal Server Error" }, { status: 500 })));

    const result = DepartmentService.getAll();

    await expect(result).rejects.toThrow("Failed to load departments");
  });

  it("getById throws when the department is missing", async () => {
    server.use(handleDepartmentGet(() => HttpResponse.json({ title: "Not Found" }, { status: 404 })));

    const result = DepartmentService.getById(999);

    await expect(result).rejects.toThrow("Failed to load department 999");
  });
});