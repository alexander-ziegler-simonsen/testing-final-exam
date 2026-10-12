import { describe, it } from "vitest";
import { placeholder } from "../test-utils/placeholder";

// Compile-time tests (expectTypeOf) for the generated types in ../api/types.gen.ts.
// The unit project runs with typecheck enabled, so these fail on a type mismatch.
// Placeholders: each test passes by default until it's implemented.

describe("types.gen", () => {
    describe("DTO types match their zod schema", () => {
        it("every input DTO type equals z.infer of its zod schema", placeholder);
        it("every output DTO type equals z.infer of its zod schema", placeholder);
    });

    describe("request data types", () => {
        it("each *Data type's url is its endpoint path literal (DepartmentGetData['url'] is '/api/Department/{id}')", placeholder);
        it("*Get, *Put and *Delete data types require path.id as a number", placeholder);
        it("*Post and *Put data types take the matching input DTO as body", placeholder);
        it("UserChangePasswordData body is a string", placeholder);
        it("PatientGetAllPatientsData and TreatmentGetAllTreatmentsData query fields are all optional", placeholder);
        it("TreatmentPostData query has an optional number staffId", placeholder);
    });

    describe("response and error types", () => {
        it("*Responses map 200 to the output DTO", placeholder);
        it("*GetAll*Responses map 200 to an array of the output DTO", placeholder);
        it("*Post responses map 200 to a number id", placeholder);
        it("count responses map 200 to a number", placeholder);
        it("*Errors map 404 to MicrosoftAspNetCoreMvcProblemDetails", placeholder);
        it("RoomBookingPostErrors and RoomBookingPutErrors map 409 to a string message", placeholder);
        it("AuthLoginErrors maps 401 to MicrosoftAspNetCoreMvcProblemDetails", placeholder);
    });

    describe("output DTOs", () => {
        it("HospitalApiDtosOutputsLoginOutputDto requires token and has an optional string role", placeholder);
        it("HospitalApiDtosOutputsUserOutputDto has no password property", placeholder);
        it("HospitalApiDtosOutputsDepartmentStaffOutputDto nests a department and a staff object", placeholder);
    });
});
