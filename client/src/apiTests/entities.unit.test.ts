import { describe, it } from "vitest";
import { placeholder } from "../test-utils/placeholder";

// Tests for the generated output DTO schemas (the entities the API returns) in
// ../api/zod.gen.ts, and for the fixtures in src/mocks/fixtures built from them.
// Placeholders: each test passes by default until it's implemented.

describe("entities (output DTOs)", () => {
    describe("fixtures match their output schema", () => {
        it("mockLogin matches zHospitalApiDtosOutputsLoginOutputDto", placeholder);
        it("mockDepartment and every item in mockDepartments match zHospitalApiDtosOutputsDepartmentOutputDto", placeholder);
        it("mockDepartmentStaff and every item in mockDepartmentStaffs match zHospitalApiDtosOutputsDepartmentStaffOutputDto", placeholder);
        it("mockMedicineProduct and every item in mockMedicineProducts match zHospitalApiDtosExternalMedicineProductOutputDto", placeholder);
        it("every item in mockE2eExternalMedicinSearchResults matches zHospitalApiDtosExternalMedicineProductOutputDto", placeholder);
        it("mockMedicineDetail and mockE2eExternalMedicinDetail match zHospitalApiDtosExternalMedicineDetailOutputDto", placeholder);
        it("mockFloorRooms matches zHospitalApiDtosOutputsFloorRoomsOutputDto", placeholder);
        it("mockLocation and every item in mockLocations match zHospitalApiDtosOutputsLocationOutputDto", placeholder);
        it("mockMedication and every item in mockMedications match zHospitalApiDtosOutputsMedicationOutputDto", placeholder);
        it("mockStorage and every item in mockStorages match zHospitalApiDtosOutputsMedicationStorageOutputDto", placeholder);
        it("mockMissing and every item in mockMissings match zHospitalApiDtosOutputsMedicationStorageMissingOutputDto", placeholder);
        it("mockPatient and every item in mockPatients match zHospitalApiDtosOutputsPatientOutputDto", placeholder);
        it("mockPrescription and every item in mockPrescriptions match zHospitalApiDtosOutputsPrescriptionOutputDto", placeholder);
        it("mockRoomBooking and every item in mockRoomBookings match zHospitalApiDtosOutputsRoomBookingOutputDto", placeholder);
        it("mockStaff and every item in mockStaffs match zHospitalApiDtosOutputsStaffOutputDto", placeholder);
        it("mockTreatment and every item in mockTreatments match zHospitalApiDtosOutputsTreatmentOutputDto", placeholder);
        it("mockTreatmentStaff and every item in mockTreatmentStaffs match zHospitalApiDtosOutputsTreatmentStaffOutputDto", placeholder);
        it("mockUser and every item in mockUsers match zHospitalApiDtosOutputsUserOutputDto", placeholder);
    });

    describe("schema rules", () => {
        it("LoginOutputDto requires a token", placeholder);
        it("LoginOutputDto token accepts 255 chars and rejects 256", placeholder);
        it("LoginOutputDto staffId and patientId accept null", placeholder);
        it("DepartmentStaffOutputDto requires a nested department and staff", placeholder);
        it("DepartmentStaffOutputDto rejects a nested staff with a 1-char firstname", placeholder);
        it("LocationOutputDto requires building and floorsWithRooms", placeholder);
        it("FloorRoomsOutputDto validates every room in rooms", placeholder);
        it("BuildingOutputDto address rejects 1 char, accepts 2 and 255, rejects 256", placeholder);
        it("RoomOutputDto name has no length limit, unlike Floor and Building", placeholder);
        it("ExternalMedicineProductOutputDto requires all six fields", placeholder);
        it("ExternalMedicineDetailOutputDto accepts null for every text field", placeholder);
        it("PatientOutputDto dateOfBirth must be an iso date, not a datetime", placeholder);
        it("RoomBookingOutputDto startTime and endTime must be UTC datetimes ending in Z", placeholder);
        it("TreatmentOutputDto description rejects 1 char, accepts 2 and 500, rejects 501", placeholder);
        it("UserOutputDto strips a password field if the API ever sends one", placeholder);
    });

    describe("fixture consistency", () => {
        it("mockLogin.role is one of the lowercase roles AuthStore accepts (doctor, nurse, admin, patient)", placeholder);
        it("mockDepartmentStaffs only reference departments in mockDepartments and staff in mockStaffs", placeholder);
        it("mockFloorRooms is one of the floors in mockLocation.floorsWithRooms", placeholder);
        it("ids are unique within each fixture list", placeholder);
    });
});
