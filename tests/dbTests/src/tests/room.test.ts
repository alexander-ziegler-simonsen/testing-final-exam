import { describe, test, expect } from "vitest";
import { getClient } from "../test-setup.js";

describe("room table - positive tests (+)", () => {
    test("(+) check count of  rooms", async () => {
        const res = await getClient().query("SELECT COUNT(*) from room");
        expect(res.rows[0].count).toBe("31"); // pg returns (COUNT) as string
    });

    test("(+) select rooms and check the values", async () => {
        const res = await getClient().query("SELECT * from room");
        expect(res.rows[0].name).toBe("room a101");
        expect(res.rows[1].name).toBe("room a102");
        expect(res.rows[5].name).toBe("room a201");
        expect(res.rows[0].fk_floor_id).toBe(1);
        expect(res.rows[1].fk_floor_id).toBe(1);
        expect(res.rows[5].fk_floor_id).toBe(2);
    });

    // add
    test("(+) add new room and check if it was added", async () => {
        const name = "newAddedroom";
        const floorId = 1;
        const newId = 32;
        const res = await getClient().query("INSERT INTO room (name, fk_floor_id) VALUES ($1,$2)", [name, floorId]);
        expect(res.rowCount).toBe(1);

        const check = await getClient().query("SELECT name FROM room WHERE id = $1", [newId]);
        expect(check.rows[0].name).toBe(name);
    });

    // edit
    test("(+) edit a room name", async () => {
        const id = 4;
        const newName = "newroomName";

        const res = await getClient().query("UPDATE room SET name = $1 WHERE id = $2", [newName, id]);
        expect(res.rowCount).toBe(1);

        const check = await getClient().query("SELECT name FROM room WHERE id = $1", [id]);
        expect(check.rows[0].name).toBe(newName);
    });

    // delete
    test("(+) delete a room", async () => {
        const id = 31;
        const res = await getClient().query("DELETE FROM room WHERE id = $1", [id]);
        expect(res.rowCount).toBe(1);
    });
});

describe("room table - negative tests (-)", () => {
    test("(-) add a room with too long a name", async () => {
        const room = "1".repeat(101);
        const floorId = 1;
        await expect(
            getClient().query("insert into room (name, fk_floor_id) VALUES ($1,$2)", [room, floorId])
        ).rejects.toMatchObject({ code: "22001" }); // string_data_right_truncation
    });

    test("(-) add a room with NULL name", async () => {
        const room = null;
        const floorId = 1;
        await expect(
            getClient().query("insert into room (name, fk_floor_id) VALUES ($1,$2)", [room, floorId])
        ).rejects.toMatchObject({ code: "23502" }); // not_null_violation
    });

    test("(-) edit a  room by an id that does not exist", async () => {
        const id = 40;
        const newName = "newroomName";
        const res = await getClient().query("UPDATE room SET name = $1 WHERE id = $2", [newName, id]);
        expect(res.rowCount).toBe(0);
    });
});
