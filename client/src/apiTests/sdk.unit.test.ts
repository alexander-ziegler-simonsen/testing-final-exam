import { describe, it } from "vitest";
import { placeholder } from "../test-utils/placeholder";

// Tests for the generated SDK functions in ../api/sdk.gen.ts.
// Placeholders: each test passes by default until it's implemented.

const endpoints = [
    { name: "authLogin", method: "POST", url: "/api/Auth/login" },
    { name: "authRefresh", method: "POST", url: "/api/Auth/refresh" },
    { name: "authLogout", method: "POST", url: "/api/Auth/logout" },
    { name: "departmentGetAllDepartments", method: "GET", url: "/api/Department" },
    { name: "departmentPost", method: "POST", url: "/api/Department" },
    { name: "departmentDelete", method: "DELETE", url: "/api/Department/{id}" },
    { name: "departmentGet", method: "GET", url: "/api/Department/{id}" },
    { name: "departmentPut", method: "PUT", url: "/api/Department/{id}" },
    { name: "departmentStaffGetAll", method: "GET", url: "/api/DepartmentStaff" },
    { name: "departmentStaffPost", method: "POST", url: "/api/DepartmentStaff" },
    { name: "departmentStaffDelete", method: "DELETE", url: "/api/DepartmentStaff/{id}" },
    { name: "departmentStaffGet", method: "GET", url: "/api/DepartmentStaff/{id}" },
    { name: "departmentStaffPut", method: "PUT", url: "/api/DepartmentStaff/{id}" },
    { name: "externalMedicinePricesGetMedicineProductsByName", method: "GET", url: "/api/ExternalMedicinePrices/productsByName" },
    { name: "externalMedicinePricesGetMedicineProductsByIngredients", method: "GET", url: "/api/ExternalMedicinePrices/productsByIngredient" },
    { name: "externalMedicinePricesGetMedicineProductDetails", method: "GET", url: "/api/ExternalMedicinePrices/productDetails" },
    { name: "locationGetAllLocations", method: "GET", url: "/api/Location" },
    { name: "locationGet", method: "GET", url: "/api/Location/{id}" },
    { name: "locationGetAllFloors", method: "GET", url: "/api/Location/floor" },
    { name: "locationPostFloor", method: "POST", url: "/api/Location/floor" },
    { name: "locationDeleteFloor", method: "DELETE", url: "/api/Location/floor/{id}" },
    { name: "locationGetFloor", method: "GET", url: "/api/Location/floor/{id}" },
    { name: "locationPutFloor", method: "PUT", url: "/api/Location/floor/{id}" },
    { name: "medicinGetAllMedicins", method: "GET", url: "/api/Medicin" },
    { name: "medicinPost", method: "POST", url: "/api/Medicin" },
    { name: "medicinDelete", method: "DELETE", url: "/api/Medicin/{id}" },
    { name: "medicinGet", method: "GET", url: "/api/Medicin/{id}" },
    { name: "medicinPut", method: "PUT", url: "/api/Medicin/{id}" },
    { name: "missingStorageGetAllMedicationStorageMissings", method: "GET", url: "/api/MissingStorage" },
    { name: "missingStoragePost", method: "POST", url: "/api/MissingStorage" },
    { name: "missingStorageDelete", method: "DELETE", url: "/api/MissingStorage/{id}" },
    { name: "missingStorageGet", method: "GET", url: "/api/MissingStorage/{id}" },
    { name: "missingStoragePut", method: "PUT", url: "/api/MissingStorage/{id}" },
    { name: "missingStorageGetMissingCount", method: "GET", url: "/api/MissingStorage/count" },
    { name: "patientGetAllPatients", method: "GET", url: "/api/Patient" },
    { name: "patientPost", method: "POST", url: "/api/Patient" },
    { name: "patientGetPatientCount", method: "GET", url: "/api/Patient/count" },
    { name: "patientDelete", method: "DELETE", url: "/api/Patient/{id}" },
    { name: "patientGet", method: "GET", url: "/api/Patient/{id}" },
    { name: "patientPut", method: "PUT", url: "/api/Patient/{id}" },
    { name: "patientRegisterBaby", method: "POST", url: "/api/Patient/register-baby" },
    { name: "prescriptionGetAllPrescriptions", method: "GET", url: "/api/Prescription" },
    { name: "prescriptionPost", method: "POST", url: "/api/Prescription" },
    { name: "prescriptionDelete", method: "DELETE", url: "/api/Prescription/{id}" },
    { name: "prescriptionGet", method: "GET", url: "/api/Prescription/{id}" },
    { name: "prescriptionPut", method: "PUT", url: "/api/Prescription/{id}" },
    { name: "roomBookingGetAll", method: "GET", url: "/api/RoomBooking" },
    { name: "roomBookingPost", method: "POST", url: "/api/RoomBooking" },
    { name: "roomBookingDelete", method: "DELETE", url: "/api/RoomBooking/{id}" },
    { name: "roomBookingGet", method: "GET", url: "/api/RoomBooking/{id}" },
    { name: "roomBookingPut", method: "PUT", url: "/api/RoomBooking/{id}" },
    { name: "roomBookingGetEmptyRoomsCountForDay", method: "GET", url: "/api/RoomBooking/empty-rooms-count" },
    { name: "roomBookingGetRoomsInUseCountByFloor", method: "GET", url: "/api/RoomBooking/rooms-in-use-count" },
    { name: "staffGetAllStaffs", method: "GET", url: "/api/Staff" },
    { name: "staffPost", method: "POST", url: "/api/Staff" },
    { name: "staffDelete", method: "DELETE", url: "/api/Staff/{id}" },
    { name: "staffGet", method: "GET", url: "/api/Staff/{id}" },
    { name: "staffPut", method: "PUT", url: "/api/Staff/{id}" },
    { name: "staffGetStaffCount", method: "GET", url: "/api/Staff/count" },
    { name: "storageGetAllMedicationStorages", method: "GET", url: "/api/Storage" },
    { name: "storagePost", method: "POST", url: "/api/Storage" },
    { name: "storageDelete", method: "DELETE", url: "/api/Storage/{id}" },
    { name: "storageGet", method: "GET", url: "/api/Storage/{id}" },
    { name: "storagePut", method: "PUT", url: "/api/Storage/{id}" },
    { name: "treatmentGetAllTreatments", method: "GET", url: "/api/Treatment" },
    { name: "treatmentPost", method: "POST", url: "/api/Treatment" },
    { name: "treatmentDelete", method: "DELETE", url: "/api/Treatment/{id}" },
    { name: "treatmentGet", method: "GET", url: "/api/Treatment/{id}" },
    { name: "treatmentPut", method: "PUT", url: "/api/Treatment/{id}" },
    { name: "treatmentStaffGetAll", method: "GET", url: "/api/TreatmentStaff" },
    { name: "treatmentStaffPost", method: "POST", url: "/api/TreatmentStaff" },
    { name: "treatmentStaffDelete", method: "DELETE", url: "/api/TreatmentStaff/{id}" },
    { name: "treatmentStaffGet", method: "GET", url: "/api/TreatmentStaff/{id}" },
    { name: "treatmentStaffPut", method: "PUT", url: "/api/TreatmentStaff/{id}" },
    { name: "userGetAll", method: "GET", url: "/api/User" },
    { name: "userRegister", method: "POST", url: "/api/User/register" },
    { name: "userChangePassword", method: "PUT", url: "/api/User/{id}/password" },
    { name: "userDelete", method: "DELETE", url: "/api/User/{id}" },
];

describe("sdk.gen", () => {
    describe("routing", () => {
        it.each(endpoints)("$name sends $method $url", placeholder);
    });

    describe("request building", () => {
        it("substitutes the id path param into the url (departmentGet -> /api/Department/1)", placeholder);
        it("substitutes the id before a trailing segment (userChangePassword -> /api/User/1/password)", placeholder);
        it("serializes query params into the query string (patientGetAllPatients filters, sortBy, sortDir)", placeholder);
        it("leaves undefined query params out of the query string", placeholder);
        it("sends the body as JSON with Content-Type: application/json on POST and PUT", placeholder);
        it("sends userChangePassword's string body as a JSON string, including numeric-only strings like \"12345678\"", placeholder);
        it("lets per-call headers override the default Content-Type", placeholder);
        it("uses the client passed in options instead of the shared client", placeholder);
    });

    describe("auth", () => {
        it("attaches Authorization: Bearer <token> on endpoints that declare bearer security", placeholder);
        it("does not attach a token to authLogin or authRefresh (no security declared)", placeholder);
        it("sends no Authorization header when the client has no auth configured", placeholder);
    });

    describe("responses", () => {
        it("returns data and no error on a 2xx response", placeholder);
        it("returns an error instead of throwing on a 4xx/5xx by default", placeholder);
        it("throws on a 4xx/5xx when throwOnError is true", placeholder);
        it("exposes the ProblemDetails body as error on a 404", placeholder);
        it("exposes the conflict message string as error on a roomBookingPost 409", placeholder);
    });
});
