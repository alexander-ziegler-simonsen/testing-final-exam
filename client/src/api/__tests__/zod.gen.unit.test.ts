import { describe, expect, it } from "vitest";
import {
    zHospitalApiDtosInputsDepartmentInputDto,
    zHospitalApiDtosInputsDepartmentStaffInputDto,
    zHospitalApiDtosInputsFloorInputDto,
    zHospitalApiDtosInputsLoginInputDto,
    zHospitalApiDtosInputsMedicationInputDto,
    zHospitalApiDtosInputsMedicationStorageInputDto,
    zHospitalApiDtosInputsMedicationStorageMissingInputDto,
    zHospitalApiDtosInputsPatientInputDto,
    zHospitalApiDtosInputsPrescriptionInputDto,
    zHospitalApiDtosInputsRegisterBabyDto,
    zHospitalApiDtosInputsRegisterInputDto,
    zHospitalApiDtosInputsRoomBookingInputDto,
    zHospitalApiDtosInputsStaffInputDto,
    zHospitalApiDtosInputsTreatmentInputDto,
    zHospitalApiDtosInputsTreatmentStaffInputDto,
    zUserChangePasswordBody,
    zUserRegisterBody,
} from "../zod.gen";

// These schemas are what every service in src/services validates its input
// against before making a request (see e.g. Patient.ts, RoomBooking.ts). This
// file tests the schemas themselves in isolation - no services, no network.

describe("zHospitalApiDtosInputsLoginInputDto", () => {
    it("accepts a valid username/password", () => {
        const result = zHospitalApiDtosInputsLoginInputDto.safeParse({
            username: "alice",
            password: "supersecret",
        });
        expect(result.success).toBe(true);
    });

    it("accepts an empty object since every field is optional", () => {
        expect(zHospitalApiDtosInputsLoginInputDto.safeParse({}).success).toBe(true);
    });

    it("rejects a username shorter than 2 characters", () => {
        const result = zHospitalApiDtosInputsLoginInputDto.safeParse({ username: "a" });
        expect(result.success).toBe(false);
    });

    it("rejects a password shorter than 8 characters", () => {
        const result = zHospitalApiDtosInputsLoginInputDto.safeParse({ password: "short1" });
        expect(result.success).toBe(false);
    });
});

describe("zHospitalApiDtosInputsDepartmentInputDto", () => {
    it("accepts a valid name and type", () => {
        const result = zHospitalApiDtosInputsDepartmentInputDto.safeParse({
            name: "Cardiology",
            type: "Clinical",
        });
        expect(result.success).toBe(true);
    });

    it("accepts null for both fields since they are nullish", () => {
        const result = zHospitalApiDtosInputsDepartmentInputDto.safeParse({ name: null, type: null });
        expect(result.success).toBe(true);
    });

    it("rejects a name shorter than 2 characters", () => {
        const result = zHospitalApiDtosInputsDepartmentInputDto.safeParse({ name: "A", type: "Clinical" });
        expect(result.success).toBe(false);
    });

    it("rejects a name longer than 100 characters", () => {
        const result = zHospitalApiDtosInputsDepartmentInputDto.safeParse({ name: "A".repeat(101) });
        expect(result.success).toBe(false);
    });
});

describe("zHospitalApiDtosInputsDepartmentStaffInputDto", () => {
    it("accepts valid integer foreign keys", () => {
        const result = zHospitalApiDtosInputsDepartmentStaffInputDto.safeParse({
            fkStaffId: 1,
            fkDepartmentId: 2,
        });
        expect(result.success).toBe(true);
    });

    it("rejects a non-integer fkStaffId", () => {
        const result = zHospitalApiDtosInputsDepartmentStaffInputDto.safeParse({ fkStaffId: 1.5 });
        expect(result.success).toBe(false);
    });

    it("rejects an fkDepartmentId outside the int32 range", () => {
        const result = zHospitalApiDtosInputsDepartmentStaffInputDto.safeParse({ fkDepartmentId: 2147483648 });
        expect(result.success).toBe(false);
    });
});

describe("zHospitalApiDtosInputsFloorInputDto", () => {
    it("accepts a valid floor", () => {
        const result = zHospitalApiDtosInputsFloorInputDto.safeParse({ name: "Floor 1", fkBuildingId: 1 });
        expect(result.success).toBe(true);
    });

    it("rejects a name shorter than 2 characters", () => {
        const result = zHospitalApiDtosInputsFloorInputDto.safeParse({ name: "A" });
        expect(result.success).toBe(false);
    });
});

describe("zHospitalApiDtosInputsMedicationInputDto", () => {
    const valid = {
        name: "Ibuprofen",
        genericName: "Ibuprofen",
        brand: "Advil",
        form: "Tablet",
        strength: "200mg",
        category: "NSAID",
        description: "Pain relief",
    };

    it("accepts a fully valid medication", () => {
        expect(zHospitalApiDtosInputsMedicationInputDto.safeParse(valid).success).toBe(true);
    });

    it("rejects a name shorter than 2 characters", () => {
        const result = zHospitalApiDtosInputsMedicationInputDto.safeParse({ ...valid, name: "I" });
        expect(result.success).toBe(false);
    });

    it("places no length constraint on description", () => {
        const result = zHospitalApiDtosInputsMedicationInputDto.safeParse({ ...valid, description: "" });
        expect(result.success).toBe(true);
    });
});

describe("zHospitalApiDtosInputsMedicationStorageInputDto", () => {
    it("accepts a valid storage entry", () => {
        const result = zHospitalApiDtosInputsMedicationStorageInputDto.safeParse({
            fkMedicationId: 1,
            amount: 50,
        });
        expect(result.success).toBe(true);
    });

    it("rejects a non-integer fkMedicationId", () => {
        const result = zHospitalApiDtosInputsMedicationStorageInputDto.safeParse({ fkMedicationId: 1.5 });
        expect(result.success).toBe(false);
    });
});

describe("zHospitalApiDtosInputsMedicationStorageMissingInputDto", () => {
    it("accepts a valid entry with an ISO datetime", () => {
        const result = zHospitalApiDtosInputsMedicationStorageMissingInputDto.safeParse({
            fkMedicationStorageId: 1,
            amountMissing: 5,
            wentMissingAt: "2026-08-01T00:00:00Z",
        });
        expect(result.success).toBe(true);
    });

    it("rejects a non-ISO wentMissingAt value", () => {
        const result = zHospitalApiDtosInputsMedicationStorageMissingInputDto.safeParse({
            wentMissingAt: "not-a-date",
        });
        expect(result.success).toBe(false);
    });
});

describe("zHospitalApiDtosInputsPatientInputDto", () => {
    const valid = {
        firstname: "Mette",
        lastname: "Sørensen",
        gender: "Female",
        cprNumber: "1503851234",
        dateOfBirth: "1985-03-15",
        weightKg: 65,
        heightCm: 168,
    };

    it("accepts a fully valid patient", () => {
        expect(zHospitalApiDtosInputsPatientInputDto.safeParse(valid).success).toBe(true);
    });

    it("rejects a firstname shorter than 2 characters", () => {
        const result = zHospitalApiDtosInputsPatientInputDto.safeParse({ ...valid, firstname: "M" });
        expect(result.success).toBe(false);
    });

    it("rejects a non-ISO dateOfBirth", () => {
        const result = zHospitalApiDtosInputsPatientInputDto.safeParse({ ...valid, dateOfBirth: "15-03-1985" });
        expect(result.success).toBe(false);
    });

    it("rejects a cprNumber longer than 10 characters", () => {
        const result = zHospitalApiDtosInputsPatientInputDto.safeParse({ ...valid, cprNumber: "15038512345" });
        expect(result.success).toBe(false);
    });
});

describe("zHospitalApiDtosInputsPrescriptionInputDto", () => {
    it("accepts a valid prescription", () => {
        const result = zHospitalApiDtosInputsPrescriptionInputDto.safeParse({
            fkMedicationId: 1,
            fkTreatmentId: 2,
            fkPrescribedByStaffId: 3,
            doses: 2,
        });
        expect(result.success).toBe(true);
    });

    it("rejects a non-integer fkMedicationId", () => {
        const result = zHospitalApiDtosInputsPrescriptionInputDto.safeParse({ fkMedicationId: 1.5 });
        expect(result.success).toBe(false);
    });
});

describe("zHospitalApiDtosInputsRegisterBabyDto", () => {
    it("accepts a valid baby registration", () => {
        const result = zHospitalApiDtosInputsRegisterBabyDto.safeParse({
            firstname: "Baby",
            lastname: "Sørensen",
            gender: "Female",
            dateOfBirth: "2026-08-01",
        });
        expect(result.success).toBe(true);
    });

    it("rejects a firstname shorter than 2 characters", () => {
        const result = zHospitalApiDtosInputsRegisterBabyDto.safeParse({ firstname: "B" });
        expect(result.success).toBe(false);
    });
});

describe("zHospitalApiDtosInputsRegisterInputDto / zUserRegisterBody", () => {
    it("is the same schema instance as zUserRegisterBody", () => {
        expect(zUserRegisterBody).toBe(zHospitalApiDtosInputsRegisterInputDto);
    });

    it("accepts a valid registration", () => {
        const result = zUserRegisterBody.safeParse({
            username: "alice",
            password: "supersecret",
            fkStaffId: 7,
            fkPatientId: null,
        });
        expect(result.success).toBe(true);
    });

    it("rejects a password shorter than 8 characters", () => {
        const result = zUserRegisterBody.safeParse({ username: "alice", password: "short1" });
        expect(result.success).toBe(false);
    });

    it("rejects a username shorter than 2 characters", () => {
        const result = zUserRegisterBody.safeParse({ username: "a" });
        expect(result.success).toBe(false);
    });
});

describe("zUserChangePasswordBody", () => {
    it("accepts any string, including an empty one", () => {
        expect(zUserChangePasswordBody.safeParse("").success).toBe(true);
        expect(zUserChangePasswordBody.safeParse("newpassword").success).toBe(true);
    });

    it("rejects a non-string value", () => {
        const result = zUserChangePasswordBody.safeParse(12345678);
        expect(result.success).toBe(false);
    });
});

describe("zHospitalApiDtosInputsRoomBookingInputDto", () => {
    it("accepts a valid room booking", () => {
        const result = zHospitalApiDtosInputsRoomBookingInputDto.safeParse({
            fkRoomId: 1,
            startTime: "2026-08-01T08:00:00Z",
            endTime: "2026-08-01T09:00:00Z",
            fkPatientId: 42,
        });
        expect(result.success).toBe(true);
    });

    it("rejects a non-ISO startTime", () => {
        const result = zHospitalApiDtosInputsRoomBookingInputDto.safeParse({ startTime: "not-a-date" });
        expect(result.success).toBe(false);
    });
});

describe("zHospitalApiDtosInputsStaffInputDto", () => {
    it("accepts a valid staff member", () => {
        const result = zHospitalApiDtosInputsStaffInputDto.safeParse({
            firstname: "Karen",
            lastname: "Holm",
            fkRoleId: 2,
        });
        expect(result.success).toBe(true);
    });

    it("rejects a firstname shorter than 2 characters", () => {
        const result = zHospitalApiDtosInputsStaffInputDto.safeParse({ firstname: "K" });
        expect(result.success).toBe(false);
    });
});

describe("zHospitalApiDtosInputsTreatmentInputDto", () => {
    it("accepts a valid treatment", () => {
        const result = zHospitalApiDtosInputsTreatmentInputDto.safeParse({
            fkPatientId: 42,
            description: "Checkup",
            time: "2026-08-01T10:00:00Z",
        });
        expect(result.success).toBe(true);
    });

    it("rejects a description shorter than 2 characters", () => {
        const result = zHospitalApiDtosInputsTreatmentInputDto.safeParse({ description: "A" });
        expect(result.success).toBe(false);
    });

    it("rejects a description longer than 500 characters", () => {
        const result = zHospitalApiDtosInputsTreatmentInputDto.safeParse({ description: "A".repeat(501) });
        expect(result.success).toBe(false);
    });

    it("rejects a non-ISO time", () => {
        const result = zHospitalApiDtosInputsTreatmentInputDto.safeParse({ time: "not-a-date" });
        expect(result.success).toBe(false);
    });
});

describe("zHospitalApiDtosInputsTreatmentStaffInputDto", () => {
    it("accepts valid integer foreign keys", () => {
        const result = zHospitalApiDtosInputsTreatmentStaffInputDto.safeParse({
            fkTreatmentId: 1,
            fkStaffId: 2,
        });
        expect(result.success).toBe(true);
    });

    it("rejects a non-integer fkTreatmentId", () => {
        const result = zHospitalApiDtosInputsTreatmentStaffInputDto.safeParse({ fkTreatmentId: 1.5 });
        expect(result.success).toBe(false);
    });
});
