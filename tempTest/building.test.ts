import { describe, test, expect } from "vitest";
import { getClient } from "../test-setup.js";


describe("building: column constraints", () => {
    test("name is NOT NULL", async () => {
        await expect(
            getClient().query("INSERT INTO building (name, address) VALUES ($1, $2)", [null, "123 test st"])
        ).rejects.toMatchObject({ code: "23502" }); // not_null_violation
    });

    test("name is capped at varchar(100)", async () => {
        const tooLong = "a".repeat(101);
        await expect(
            getClient().query("INSERT INTO building (name) VALUES ($1)", [tooLong])
        ).rejects.toMatchObject({ code: "22001" }); // string_data_right_truncation
    });

    test("address is nullable", async () => {
        const res = await getClient().query(
            "INSERT INTO building (name, address) VALUES ($1, $2) RETURNING address",
            ["no address building", null]
        );
        expect(res.rows[0].address).toBeNull();
    });

    test("address is capped at varchar(255)", async () => {
        const tooLong = "a".repeat(256);
        await expect(
            getClient().query("INSERT INTO building (name, address) VALUES ($1, $2)", ["overflow address", tooLong])
        ).rejects.toMatchObject({ code: "22001" }); // string_data_right_truncation
    });

    test("id is a generated-always identity and rejects an explicit value on insert", async () => {
        await expect(
            getClient().query("INSERT INTO building (id, name) VALUES ($1, $2)", [999999, "explicit id"])
        ).rejects.toMatchObject({ code: "428C9" }); // generated_always_as_identity_column_used
    });

    test("id is a generated-always identity and rejects being updated", async () => {
        const client = getClient();
        const { rows } = await client.query("SELECT id FROM building WHERE name = 'main hospital'");
        const buildingId = rows[0].id;

        await expect(
            client.query("UPDATE building SET id = $1 WHERE id = $2", [999999, buildingId])
        ).rejects.toMatchObject({ code: "428C9" }); // generated_always_as_identity_column_used
    });
});

describe("building: referential integrity with floor", () => {
    test("deleting a building that still has floors is rejected", async () => {
        const client = getClient();
        const { rows } = await client.query("SELECT id FROM building WHERE name = 'main hospital'");
        const buildingId = rows[0].id;

        await expect(client.query("DELETE FROM building WHERE id = $1", [buildingId])).rejects.toMatchObject({
            code: "23503", // foreign_key_violation
        });
    });

    test("deleting a building with no referencing floors succeeds", async () => {
        const client = getClient();
        const inserted = await client.query(
            "INSERT INTO building (name, address) VALUES ($1, $2) RETURNING id",
            ["orphan building", null]
        );
        const buildingId = inserted.rows[0].id;

        const deleted = await client.query("DELETE FROM building WHERE id = $1", [buildingId]);
        expect(deleted.rowCount).toBe(1);

        const check = await client.query("SELECT 1 FROM building WHERE id = $1", [buildingId]);
        expect(check.rowCount).toBe(0);
    });
});

describe("building: basic CRUD sanity", () => {
    test("insert then select roundtrip preserves values", async () => {
        const client = getClient();
        const inserted = await client.query(
            "INSERT INTO building (name, address) VALUES ($1, $2) RETURNING id",
            ["roundtrip wing", "42 roundtrip rd"]
        );
        const buildingId = inserted.rows[0].id;

        const res = await client.query("SELECT name, address FROM building WHERE id = $1", [buildingId]);
        expect(res.rows[0]).toEqual({ name: "roundtrip wing", address: "42 roundtrip rd" });
    });
});
