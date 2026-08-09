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
        const locations = await LocationService.getAll();
        expect(locations).toEqual(mockLocations);
    });

    it("getAll throws when the API errors", async () => {
        server.use(
            handleLocationGetAllLocations(() =>
                HttpResponse.json({ title: "Internal Server Error" }, { status: 500 }),
            ),
        );

        await expect(LocationService.getAll()).rejects.toThrow("Failed to load locations");
    });

    it("getById returns a single mocked location", async () => {
        const location = await LocationService.getById(1);
        expect(location).toEqual(mockLocation);
    });

    it("getById throws when the location is missing", async () => {
        server.use(
            handleLocationGet(() => HttpResponse.json({ title: "Not Found" }, { status: 404 })),
        );

        await expect(LocationService.getById(999)).rejects.toThrow("Failed to load location 999");
    });

    it("getAllFloorRooms returns the mocked floor list", async () => {
        const floors = await LocationService.getAllFloorRooms();
        expect(floors).toEqual(mockLocation.floorsWithRooms);
    });

    it("getAllFloorRooms throws when the API errors", async () => {
        server.use(
            handleLocationGetAllFloors(() =>
                HttpResponse.json({ title: "Internal Server Error" }, { status: 500 }),
            ),
        );

        await expect(LocationService.getAllFloorRooms()).rejects.toThrow("Failed to load floors");
    });

    it("getOneFloorRooms returns a single mocked floor", async () => {
        const floor = await LocationService.getOneFloorRooms(2);
        expect(floor).toEqual(mockFloorRooms);
    });

    it("getOneFloorRooms throws when the floor is missing", async () => {
        server.use(
            handleLocationGetFloor(() => HttpResponse.json({ title: "Not Found" }, { status: 404 })),
        );

        await expect(LocationService.getOneFloorRooms(999)).rejects.toThrow("Failed to load floor 999");
    });

    it("createFloor posts the input and returns the new id", async () => {
        const newId = await LocationService.createFloor({ name: "4th floor", fkBuildingId: 1 });
        expect(newId).toBe(100);
    });

    it("createFloor throws when the API errors", async () => {
        server.use(
            handleLocationPostFloor(() =>
                HttpResponse.json({ title: "Internal Server Error" }, { status: 500 }),
            ),
        );

        await expect(
            LocationService.createFloor({ name: "4th floor", fkBuildingId: 1 }),
        ).rejects.toThrow("Failed to create floor");
    });

    it("createFloor throws when the API returns a non-number id", async () => {
        server.use(handleLocationPostFloor(() => HttpResponse.json(null, { status: 200 })));

        await expect(
            LocationService.createFloor({ name: "4th floor", fkBuildingId: 1 }),
        ).rejects.toThrow("Failed to create floor");
    });

    it("putFloor resolves without throwing on success", async () => {
        await expect(
            LocationService.putFloor(2, { name: "2nd floor", fkBuildingId: 1 }),
        ).resolves.toBeUndefined();
    });

    it("putFloor throws when the API errors", async () => {
        server.use(
            handleLocationPutFloor(() =>
                HttpResponse.json({ title: "Internal Server Error" }, { status: 500 }),
            ),
        );

        await expect(
            LocationService.putFloor(2, { name: "2nd floor", fkBuildingId: 1 }),
        ).rejects.toThrow("Failed to update floor 2");
    });

    it("deleteFloor resolves without throwing on success", async () => {
        await expect(LocationService.deleteFloor(2)).resolves.toBeUndefined();
    });

    it("deleteFloor throws when the API errors", async () => {
        server.use(
            handleLocationDeleteFloor(() =>
                HttpResponse.json({ title: "Internal Server Error" }, { status: 500 }),
            ),
        );

        await expect(LocationService.deleteFloor(2)).rejects.toThrow("Failed to delete floor 2");
    });
});
