import { HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import {
    handleTreatmentDelete,
    handleTreatmentGet,
    handleTreatmentGetAllTreatments,
    handleTreatmentPost,
    handleTreatmentPut,
} from "../api/msw.gen";
import { mockTreatment, mockTreatments } from "../mocks/fixtures";
import { server } from "../mocks/Server";
import { TreatmentService } from "./Treatment";

const validInput = {
    fkPatientId: 42,
    description: "Rutinetjek og blodprøve",
    time: "2026-08-04T09:00:00Z",
};

describe("TreatmentService", () => {
    it("getAll returns the mocked treatment list", async () => {
        const treatments = await TreatmentService.getAll();
        expect(treatments).toEqual(mockTreatments);
    });

    it("getAll sends the filter, sortBy and sortDir as query params", async () => {
        let query: URLSearchParams | undefined;
        server.use(
            handleTreatmentGetAllTreatments((info) => {
                query = new URL(info.request.url).searchParams;
                return HttpResponse.json(mockTreatments, { status: 200 });
            }),
        );

        await TreatmentService.getAll(
            { fkPatientId: 42, description: "blood test", time: "2026-08-04T09:00:00Z" },
            "time",
            "desc",
        );

        expect(query?.get("FkPatientId")).toBe("42");
        expect(query?.get("Description")).toBe("blood test");
        expect(query?.get("Time")).toBe("2026-08-04T09:00:00Z");
        expect(query?.get("sortBy")).toBe("time");
        expect(query?.get("sortDir")).toBe("desc");
    });

    it("getAll throws when the API errors", async () => {
        server.use(
            handleTreatmentGetAllTreatments(() =>
                HttpResponse.json({ title: "Internal Server Error" }, { status: 500 }),
            ),
        );

        await expect(TreatmentService.getAll()).rejects.toThrow("Failed to load treatments");
    });

    it("getById returns a single mocked treatment", async () => {
        const treatment = await TreatmentService.getById(mockTreatment.id!);
        expect(treatment).toEqual(mockTreatment);
    });

    it("getById throws when the treatment is missing", async () => {
        server.use(
            handleTreatmentGet(() => HttpResponse.json({ title: "Not Found" }, { status: 404 })),
        );

        await expect(TreatmentService.getById(999)).rejects.toThrow("Failed to load treatment 999");
    });

    it("create posts the input and returns the new id", async () => {
        const newId = await TreatmentService.create(validInput);
        expect(newId).toBe(100);
    });

    it("create omits the staffId query param when no staffId is given", async () => {
        let query: URLSearchParams | undefined;
        server.use(
            handleTreatmentPost((info) => {
                query = new URL(info.request.url).searchParams;
                return HttpResponse.json(100, { status: 200 });
            }),
        );

        await TreatmentService.create(validInput);

        expect(query?.has("staffId")).toBe(false);
    });

    it("create includes the staffId query param when a truthy staffId is given", async () => {
        let query: URLSearchParams | undefined;
        server.use(
            handleTreatmentPost((info) => {
                query = new URL(info.request.url).searchParams;
                return HttpResponse.json(100, { status: 200 });
            }),
        );

        await TreatmentService.create(validInput, 5);

        expect(query?.get("staffId")).toBe("5");
    });

    // staffId ? { staffId } : undefined treats 0 as "no staffId" even though 0
    // could be a legitimate id - documents the current (possibly surprising) behavior.
    it("omits the staffId query param when staffId is 0", async () => {
        let query: URLSearchParams | undefined;
        server.use(
            handleTreatmentPost((info) => {
                query = new URL(info.request.url).searchParams;
                return HttpResponse.json(100, { status: 200 });
            }),
        );

        await TreatmentService.create(validInput, 0);

        expect(query?.has("staffId")).toBe(false);
    });

    it("create throws when the API errors", async () => {
        server.use(
            handleTreatmentPost(() =>
                HttpResponse.json({ title: "Internal Server Error" }, { status: 500 }),
            ),
        );

        await expect(TreatmentService.create(validInput)).rejects.toThrow("Failed to create treatment");
    });

    it("create throws when the API returns a non-number id", async () => {
        server.use(handleTreatmentPost(() => HttpResponse.json(null, { status: 200 })));

        await expect(TreatmentService.create(validInput)).rejects.toThrow("Failed to create treatment");
    });

    it("update resolves without throwing on success", async () => {
        await expect(TreatmentService.update(mockTreatment.id!, validInput)).resolves.toBeUndefined();
    });

    it("update throws when the API errors", async () => {
        server.use(
            handleTreatmentPut(() =>
                HttpResponse.json({ title: "Internal Server Error" }, { status: 500 }),
            ),
        );

        await expect(TreatmentService.update(mockTreatment.id!, validInput)).rejects.toThrow(
            `Failed to update treatment ${mockTreatment.id}`,
        );
    });

    it("delete resolves without throwing on success", async () => {
        await expect(TreatmentService.delete(mockTreatment.id!)).resolves.toBeUndefined();
    });

    it("delete throws when the API errors", async () => {
        server.use(
            handleTreatmentDelete(() =>
                HttpResponse.json({ title: "Internal Server Error" }, { status: 500 }),
            ),
        );

        await expect(TreatmentService.delete(mockTreatment.id!)).rejects.toThrow(
            `Failed to delete treatment ${mockTreatment.id}`,
        );
    });
});
