import { HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import {
    handleLocationDeleteFloor,
    handleLocationGet,
    handleLocationGetAllFloors,
    handleLocationGetAllLocations,
    handleLocationGetFloor,
    handleLocationPostFloor,
    handleLocationPutFloor,
} from "../api/msw.gen";
import { mockFloorRooms, mockLocation, mockLocations } from "../mocks/fixtures";
import { server } from "../mocks/Server";
import { LocationService } from "./Location";

describe("LocationService", () => {
    it("getAll returns the mocked location list", async () => {
        server.use(handleLocationGetAllLocations({ body: mockLocations }));
        const locations = await LocationService.getAll();
        expect(locations).toEqual(mockLocations);
    });

    it("getAll throws when the API errors", async () => {
        server.use(
            handleLocationGetAllLocations(() =>
                HttpResponse.json({ title: "Internal Server Error" }, { status: 500 }),
            ),
        );
        const result = LocationService.getAll();
        await expect(result).rejects.toThrow("Failed to load locations");
    });

    it("getById returns a single mocked location", async () => {
        server.use(handleLocationGet({ body: mockLocation }));
        const location = await LocationService.getById(1);
        expect(location).toEqual(mockLocation);
    });

    it("getById throws when the location is missing", async () => {
        server.use(
            handleLocationGet(() => HttpResponse.json({ title: "Not Found" }, { status: 404 })),
        );
        const result = LocationService.getById(999);
        await expect(result).rejects.toThrow("Failed to load location 999");
    });

    it("getAllFloorRooms returns the mocked floor list", async () => {
        server.use(handleLocationGetAllFloors({ body: mockLocation.floorsWithRooms }));
        const floors = await LocationService.getAllFloorRooms();
        expect(floors).toEqual(mockLocation.floorsWithRooms);
    });

    it("getAllFloorRooms throws when the API errors", async () => {
        server.use(
            handleLocationGetAllFloors(() =>
                HttpResponse.json({ title: "Internal Server Error" }, { status: 500 }),
            ),
        );
        const result = LocationService.getAllFloorRooms();
        await expect(result).rejects.toThrow("Failed to load floors");
    });

    it("getOneFloorRooms returns a single mocked floor", async () => {
        server.use(handleLocationGetFloor({ body: mockFloorRooms }));
        const floor = await LocationService.getOneFloorRooms(2);
        expect(floor).toEqual(mockFloorRooms);
    });

    it("getOneFloorRooms throws when the floor is missing", async () => {
        server.use(
            handleLocationGetFloor(() => HttpResponse.json({ title: "Not Found" }, { status: 404 })),
        );
        const result = LocationService.getOneFloorRooms(999);
        await expect(result).rejects.toThrow("Failed to load floor 999");
    });

    it("createFloor posts the input and returns the new id", async () => {
        server.use(handleLocationPostFloor({ body: 100 }));
        const newId = await LocationService.createFloor({ name: "4th floor", fkBuildingId: 1 });
        expect(newId).toBe(100);
    });

    it("createFloor throws when the API errors", async () => {
        server.use(
            handleLocationPostFloor(() =>
                HttpResponse.json({ title: "Internal Server Error" }, { status: 500 }),
            ),
        );
        const result = LocationService.createFloor({ name: "4th floor", fkBuildingId: 1 });
        await expect(result).rejects.toThrow("Failed to create floor");
    });

    it("createFloor throws when the API returns a non-number id", async () => {
        server.use(handleLocationPostFloor(() => HttpResponse.json(null, { status: 200 })));
        const result = LocationService.createFloor({ name: "4th floor", fkBuildingId: 1 });
        await expect(result).rejects.toThrow("Failed to create floor");
    });

    it("putFloor resolves without throwing on success", async () => {
        server.use(handleLocationPutFloor(() => new HttpResponse(null, { status: 204 })));
        const result = LocationService.putFloor(2, { name: "2nd floor", fkBuildingId: 1 });
        await expect(result).resolves.toBeUndefined();
    });

    it("putFloor throws when the API errors", async () => {
        server.use(
            handleLocationPutFloor(() =>
                HttpResponse.json({ title: "Internal Server Error" }, { status: 500 }),
            ),
        );
        const result = LocationService.putFloor(2, { name: "2nd floor", fkBuildingId: 1 });
        await expect(result).rejects.toThrow("Failed to update floor 2");
    });

    it("deleteFloor resolves without throwing on success", async () => {
        server.use(handleLocationDeleteFloor({ body: null }));
        const result = LocationService.deleteFloor(2);
        await expect(result).resolves.toBeUndefined();
    });

    it("deleteFloor throws when the API errors", async () => {
        server.use(
            handleLocationDeleteFloor(() =>
                HttpResponse.json({ title: "Internal Server Error" }, { status: 500 }),
            ),
        );
        const result = LocationService.deleteFloor(2);
        await expect(result).rejects.toThrow("Failed to delete floor 2");
    });
});
