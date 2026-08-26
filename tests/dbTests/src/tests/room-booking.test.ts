import { describe, test, expect } from "vitest";
import { getClient } from "../test-setup.js";

describe("room_booking table - positive tests (+)", () => {
    test("(+) check count of room_booking fk_room_ids", async () => {
        const res = await getClient().query("SELECT COUNT(*) from room_booking");
        expect(res.rows[0].count).toBe("11"); // pg returns (COUNT) as string
    });

    test("(+) select fk_room_ids and check the values", async () => {
        const res = await getClient().query("SELECT * from room_booking");
        expect(res.rows[0].fk_room_id).toBe(1);
        expect(res.rows[0].fk_patient_id).toBe(1);
        expect(res.rows[1].fk_room_id).toBe(2);
        expect(res.rows[1].fk_patient_id).toBe(2);
    });

    // add
    test("(+) add new fk_room_id and check if it was added", async () => {
        const fk_room_id = 1;
        const newId = 12;
        const fk_patient_id = 1;
        const start_time = "2025-10-07 10:00:00";
        const end_time = "2025-10-07 14:00:00";
        const res = await getClient().query("INSERT INTO room_booking (fk_room_id, start_time, end_time, fk_patient_id) VALUES ($1,$2,$3,$4)", [fk_room_id, start_time, end_time, fk_patient_id]);
        expect(res.rowCount).toBe(1);

        const check = await getClient().query("SELECT * FROM room_booking WHERE id = $1", [newId]);
        expect(check.rows[0].fk_room_id).toBe(fk_room_id);
        expect(check.rows[0].fk_patient_id).toBe(fk_patient_id);
        expect(check.rows[0].id).toBe(newId);
        expect(check.rows[0].start_time).toEqual(new Date(start_time));
        expect(check.rows[0].end_time).toEqual(new Date(end_time));
    });

    // edit
    test("(+) edit a room_booking fk_room_id", async () => {
        const id = 4;
        const newFk_room_id = 1;

        const res = await getClient().query("UPDATE room_booking SET fk_room_id = $1 WHERE id = $2", [newFk_room_id, id]);
        expect(res.rowCount).toBe(1);

        const check = await getClient().query("SELECT fk_room_id FROM room_booking WHERE id = $1", [id]);
        expect(check.rows[0].fk_room_id).toBe(newFk_room_id);
    });

    // delete
    test("(+) delete a room_booking", async () => {
        const id = 11;
        const res = await getClient().query("DELETE FROM room_booking WHERE id = $1", [id]);
        expect(res.rowCount).toBe(1);
    });
});

describe("room_booking table - negative tests (-)", () => {
    // test("(-) add a room_booking with too long a fk_room_id", async () => {
    //     const fk_room_id = 1;
    //     const fk_patient_id = 1;
    //     const start_time = "2025-10-07 10:00:00";
    //     const end_time = "2025-10-07 14:00:00";
    //     await expect(
    //         getClient().query("INSERT INTO room_booking (fk_room_id, start_time, end_time, fk_patient_id, fk_role_id) VALUES ($1,$2,$3,$4)", [fk_room_id, start_time, end_time, fk_patient_id])
    //     ).rejects.toMatchObject({ code: "22001" }); // string_data_right_truncation
    // });

    test("(-) add a room booking with NULL fk_room_id", async () => {
        const fk_room_id = null;
        const fk_patient_id = 1;
        const start_time = "2025-10-07 10:00:00";
        const end_time = "2025-10-07 14:00:00";
        await expect(
            getClient().query("INSERT INTO room_booking (fk_room_id, start_time, end_time, fk_patient_id) VALUES ($1,$2,$3,$4)", [fk_room_id, start_time, end_time, fk_patient_id])
        ).rejects.toMatchObject({ code: "23502" }); // not_null_violation
    });

    test("(-) edit a room_booking fk_room_id by an id that does not exist", async () => {
        const id = 400;
        const newFk_room_id = 1;
        const res = await getClient().query("UPDATE room_booking SET fk_room_id = $1 WHERE id = $2", [newFk_room_id, id]);
        expect(res.rowCount).toBe(0);
    });
});
