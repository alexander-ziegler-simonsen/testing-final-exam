import { HttpResponse } from "msw";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { authRefresh } from "../api";
import { handleAuthRefresh, handleDepartmentGetAllDepartments, handlePatientGetAllPatients } from "../api/msw.gen";
import { mockLogin } from "../mocks/fixtures";
import { mockPatients } from "../mocks/fixtures";
import { mockDepartments } from "../mocks/fixtures";
import { server } from "../mocks/Server";
import { PatientService } from "./Patient";
import { DepartmentService } from "./Department";
import { setupAuthInterceptor } from "./authInterceptor";
import { useAuthStore } from "../stores/AuthStore";

// Registered once: setupAuthInterceptor pushes a new axios interceptor on every
// call, so calling it per-test would stack duplicate handlers on client.instance.
beforeAll(() => {
    setupAuthInterceptor();
});

beforeEach(() => {
    useAuthStore.getState().clearSession();
});

describe("setupAuthInterceptor", () => {
    it("passes non-401 errors through without attempting a refresh", async () => {
        let refreshCalls = 0;
        server.use(
            handleAuthRefresh(() => {
                refreshCalls++;
                return HttpResponse.json(mockLogin, { status: 200 });
            }),
            handlePatientGetAllPatients(() =>
                HttpResponse.json({ title: "Internal Server Error" }, { status: 500 }),
            ),
        );

        const result = PatientService.getAll();

        await expect(result).rejects.toThrow("Failed to load patients");
        expect(refreshCalls).toBe(0);
    });

    it("refreshes the token and retries the original request after a 401", async () => {
        let refreshCalls = 0;
        let patientCalls = 0;
        let authHeaderOnRetry: string | null = null;

        server.use(
            handleAuthRefresh(() => {
                refreshCalls++;
                return HttpResponse.json(mockLogin, { status: 200 });
            }),
            handlePatientGetAllPatients((info) => {
                patientCalls++;
                if (patientCalls === 1) {
                    return HttpResponse.json({ title: "Unauthorized" }, { status: 401 });
                }
                authHeaderOnRetry = info.request.headers.get("authorization");
                return HttpResponse.json(mockPatients, { status: 200 });
            }),
        );

        const patients = await PatientService.getAll();

        expect(patients).toEqual(mockPatients);
        expect(refreshCalls).toBe(1);
        expect(patientCalls).toBe(2);
        expect(authHeaderOnRetry).toBe(`Bearer ${mockLogin.token}`);
        expect(useAuthStore.getState().accessToken).toBe(mockLogin.token);
        expect(useAuthStore.getState().user).toEqual({
            staffId: mockLogin.staffId,
            patientId: null,
            firstName: mockLogin.firstname,
            lastName: mockLogin.lastname,
            role: mockLogin.role,
        });
    });

    it("clears the session and rejects the original error when refresh fails", async () => {
        useAuthStore.getState().setSession("stale-token", {
            staffId: 1,
            patientId: null,
            firstName: "Old",
            lastName: "Session",
            role: "nurse",
        });

        server.use(
            handleAuthRefresh(() => HttpResponse.json({ title: "Unauthorized" }, { status: 401 })),
            handlePatientGetAllPatients(() =>
                HttpResponse.json({ title: "Unauthorized" }, { status: 401 }),
            ),
        );

        const result = PatientService.getAll();

        await expect(result).rejects.toThrow("Failed to load patients");
        expect(useAuthStore.getState().accessToken).toBeNull();
        expect(useAuthStore.getState().user).toBeNull();
    });

    it("does not attempt a second refresh when the retried request also gets a 401", async () => {
        let refreshCalls = 0;
        let patientCalls = 0;

        server.use(
            handleAuthRefresh(() => {
                refreshCalls++;
                return HttpResponse.json(mockLogin, { status: 200 });
            }),
            handlePatientGetAllPatients(() => {
                patientCalls++;
                return HttpResponse.json({ title: "Unauthorized" }, { status: 401 });
            }),
        );

        const result = PatientService.getAll();

        await expect(result).rejects.toThrow("Failed to load patients");
        expect(patientCalls).toBe(2);
        expect(refreshCalls).toBe(1);
    });

    it("does not attempt a refresh for a 401 from the refresh endpoint itself", async () => {
        let refreshCalls = 0;

        server.use(
            handleAuthRefresh(() => {
                refreshCalls++;
                return HttpResponse.json({ title: "Unauthorized" }, { status: 401 });
            }),
        );

        const { error } = await authRefresh();

        expect(error).toBeTruthy();
        expect(refreshCalls).toBe(1);
    });

    it("refreshes again on a second, independent 401 after an earlier refresh already succeeded", async () => {
        let refreshCalls = 0;
        let patientCalls = 0;

        server.use(
            handleAuthRefresh(() => {
                refreshCalls++;
                return HttpResponse.json(mockLogin, { status: 200 });
            }),
            handlePatientGetAllPatients(() => {
                patientCalls++;
                // every odd call simulates the access token being expired again
                if (patientCalls % 2 === 1) {
                    return HttpResponse.json({ title: "Unauthorized" }, { status: 401 });
                }
                return HttpResponse.json(mockPatients, { status: 200 });
            }),
        );

        const first = await PatientService.getAll();
        expect(first).toEqual(mockPatients);
        expect(refreshCalls).toBe(1);

        const second = await PatientService.getAll();
        expect(second).toEqual(mockPatients);
        expect(refreshCalls).toBe(2);
    });

    it("coalesces concurrent 401s into a single refresh call", async () => {
        let refreshCalls = 0;
        let patientCalls = 0;
        let departmentCalls = 0;

        server.use(
            handleAuthRefresh(() => {
                refreshCalls++;
                return HttpResponse.json(mockLogin, { status: 200 });
            }),
            handlePatientGetAllPatients(() => {
                patientCalls++;
                if (patientCalls === 1) {
                    return HttpResponse.json({ title: "Unauthorized" }, { status: 401 });
                }
                return HttpResponse.json(mockPatients, { status: 200 });
            }),
            handleDepartmentGetAllDepartments(() => {
                departmentCalls++;
                if (departmentCalls === 1) {
                    return HttpResponse.json({ title: "Unauthorized" }, { status: 401 });
                }
                return HttpResponse.json(mockDepartments, { status: 200 });
            }),
        );

        const [patients, departments] = await Promise.all([PatientService.getAll(), DepartmentService.getAll()]);

        expect(patients).toEqual(mockPatients);
        expect(departments).toEqual(mockDepartments);
        expect(refreshCalls).toBe(1);
    });
});
