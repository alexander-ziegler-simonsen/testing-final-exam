import { describe, it } from "vitest";
import { placeholder } from "../test-utils/placeholder";

// Tests for the generated input, request and response schemas in ../api/zod.gen.ts.
// Output DTO schemas (entities) are covered in entities.unit.test.ts.
// Placeholders: each test passes by default until it's implemented.

describe("zod.gen", () => {
    describe("shared rules", () => {
        describe("int32 (ids and foreign keys)", () => {
            it("accepts the lower boundary -2147483648", placeholder);
            it("accepts the upper boundary 2147483647", placeholder);
            it("rejects -2147483649, just below the lower boundary", placeholder);
            it("rejects 2147483648, just above the upper boundary", placeholder);
            it("rejects a decimal like 1.5", placeholder);
            it("rejects a numeric string like \"1\"", placeholder);
        });

        describe("iso datetime (z.iso.datetime)", () => {
            it("accepts a UTC timestamp ending in Z", placeholder);
            it("rejects a timestamp with a +02:00 offset", placeholder);
            it("rejects a timestamp without a timezone", placeholder);
            it("rejects a date without a time", placeholder);
        });

        describe("iso date (z.iso.date)", () => {
            it("accepts YYYY-MM-DD", placeholder);
            it("accepts 29 February in a leap year (2024-02-29)", placeholder);
            it("rejects 29 February in a non-leap year (2026-02-29)", placeholder);
            it("rejects an impossible date like 2026-02-30", placeholder);
            it("rejects a full datetime", placeholder);
        });

        describe("objects", () => {
            it("strips unknown keys such as id from the parsed output", placeholder);
            it("accepts an empty object for every input schema, since all fields are optional", placeholder);
        });
    });

    describe("input schemas", () => {
        describe("zHospitalApiDtosInputsDepartmentInputDto", () => {
            it.each(["name", "type"])("%s rejects 1 char, accepts 2 and 100, rejects 101", placeholder);
            it("name and type accept null", placeholder);
        });

        describe("zHospitalApiDtosInputsDepartmentStaffInputDto", () => {
            it.each(["fkStaffId", "fkDepartmentId"])("%s must be an int32", placeholder);
        });

        describe("zHospitalApiDtosInputsFloorInputDto", () => {
            it("name rejects 1 char, accepts 2 and 100, rejects 101", placeholder);
            it("name rejects null (optional, not nullish)", placeholder);
            it("fkBuildingId must be an int32", placeholder);
        });

        describe("zHospitalApiDtosInputsLoginInputDto", () => {
            it("username rejects 1 char, accepts 2 and 100, rejects 101", placeholder);
            it("password rejects 7 chars, accepts 8 and 40, rejects 41", placeholder);
        });

        describe("zHospitalApiDtosInputsMedicationInputDto", () => {
            it.each(["name", "genericName", "brand", "form", "strength", "category"])(
                "%s rejects 1 char, accepts 2 and 100, rejects 101",
                placeholder,
            );
            it("description has no length limit (accepts an empty and a very long string)", placeholder);
        });

        describe("zHospitalApiDtosInputsMedicationStorageInputDto", () => {
            it("fkMedicationId must be an int32", placeholder);
            it("amount accepts decimals", placeholder);
            it("amount accepts negative numbers (no minimum)", placeholder);
        });

        describe("zHospitalApiDtosInputsMedicationStorageMissingInputDto", () => {
            it("fkMedicationStorageId must be an int32", placeholder);
            it("amountMissing accepts negative numbers (no minimum)", placeholder);
            it("wentMissingAt must be an iso datetime", placeholder);
        });

        describe("zHospitalApiDtosInputsPatientInputDto", () => {
            it.each(["firstname", "lastname"])("%s rejects 1 char, accepts 2 and 100, rejects 101", placeholder);
            it("gender rejects 1 char, accepts 2 and 50, rejects 51", placeholder);
            it("cprNumber accepts an empty string and 10 chars, rejects 11", placeholder);
            it("cprNumber accepts letters (no digit format check)", placeholder);
            it("dateOfBirth must be an iso date and accepts null", placeholder);
            it.each(["weightKg", "heightCm"])("%s accepts negative numbers (no minimum)", placeholder);
        });

        describe("zHospitalApiDtosInputsPrescriptionInputDto", () => {
            it.each(["fkMedicationId", "fkTreatmentId", "fkPrescribedByStaffId"])("%s must be an int32", placeholder);
            it("doses accepts 0 and negative numbers (no minimum)", placeholder);
        });

        describe("zHospitalApiDtosInputsRegisterBabyDto", () => {
            it.each(["firstname", "lastname"])("%s rejects 1 char, accepts 2 and 100, rejects 101", placeholder);
            it("gender rejects 1 char, accepts 2 and 50, rejects 51", placeholder);
            it("dateOfBirth must be an iso date", placeholder);
            it("dateOfBirth rejects null (optional, not nullish)", placeholder);
        });

        describe("zHospitalApiDtosInputsRegisterInputDto", () => {
            it("username rejects 1 char, accepts 2 and 100, rejects 101", placeholder);
            it("password rejects 7 chars, accepts 8 and 40, rejects 41", placeholder);
            it.each(["fkStaffId", "fkPatientId"])("%s accepts null or an int32", placeholder);
        });

        describe("zHospitalApiDtosInputsRoomBookingInputDto", () => {
            it.each(["fkRoomId", "fkPatientId"])("%s must be an int32", placeholder);
            it.each(["startTime", "endTime"])("%s must be an iso datetime", placeholder);
            it("accepts an endTime before startTime (no cross-field check)", placeholder);
        });

        describe("zHospitalApiDtosInputsStaffInputDto", () => {
            it.each(["firstname", "lastname"])("%s rejects 1 char, accepts 2 and 100, rejects 101", placeholder);
            it("fkRoleId must be an int32", placeholder);
        });

        describe("zHospitalApiDtosInputsTreatmentInputDto", () => {
            it("fkPatientId must be an int32", placeholder);
            it("description rejects 1 char, accepts 2 and 500, rejects 501", placeholder);
            it("time must be an iso datetime", placeholder);
        });

        describe("zHospitalApiDtosInputsTreatmentStaffInputDto", () => {
            it.each(["fkTreatmentId", "fkStaffId"])("%s must be an int32", placeholder);
        });
    });

    describe("request schemas", () => {
        it("every *PostBody and *PutBody is the same schema as its input DTO", placeholder);
        it("zUserRegisterBody is zHospitalApiDtosInputsRegisterInputDto", placeholder);
        it("zUserChangePasswordBody accepts any string, even one shorter than the 8-char register minimum", placeholder);
        it("every *Path schema requires id as an int32", placeholder);
        it("every *Path schema rejects a missing id", placeholder);
        it("zPatientGetAllPatientsQuery defaults sortDir to asc when omitted", placeholder);
        it("zPatientGetAllPatientsQuery applies the same length limits as the patient input DTO", placeholder);
        it("zTreatmentGetAllTreatmentsQuery defaults sortDir to asc when omitted", placeholder);
        it("zTreatmentPostQuery accepts an optional int32 staffId", placeholder);
        it("zRoomBookingGetEmptyRoomsCountForDayQuery requires date to be an iso datetime, not a plain date", placeholder);
        it("zRoomBookingGetRoomsInUseCountByFloorQuery requires floorFkId to be an int32", placeholder);
        it("the external medicine queries accept any productName, ingredientName and productDetailId string", placeholder);
    });

    describe("response schemas", () => {
        it("every *PostResponse accepts an int32 id", placeholder);
        it("every *PostResponse accepts no content (204)", placeholder);
        it("every *PostResponse rejects a decimal or string id", placeholder);
        it("count responses accept an int32 and reject decimals", placeholder);
        it("zUserRegisterResponse accepts a boolean or no content", placeholder);
        it("zAuthLogoutResponse and the *DeleteResponse schemas accept no content", placeholder);
        it("zMicrosoftAspNetCoreMvcProblemDetails accepts a body with only title and status", placeholder);
    });
});
