import { HttpResponse } from "msw";
import { createMswHandlers } from "../api/msw.gen";
import * as fx from "./fixtures";

const { all } = createMswHandlers();

// Default fake responses for every endpoint, so the browser worker and the test
// server both serve realistic data out of the box. Override per-test with
// `server.use(handleX({ body: ... }))`.
export const handlers = all({
    pick: {
        authLogin: { body: fx.mockLogin },

        departmentGetAllDepartments: { body: fx.mockDepartments },
        departmentGet: { body: fx.mockDepartment },
        departmentPost: { body: 100 },
        departmentPut: { body: null },
        departmentDelete: { body: null },

        departmentStaffGetAll: { body: fx.mockDepartmentStaffs },
        departmentStaffGet: { body: fx.mockDepartmentStaff },
        departmentStaffPost: { body: 100 },
        departmentStaffPut: { body: null },
        departmentStaffDelete: () => new HttpResponse(null, { status: 204 }),

        externalMedicinePricesGetMedicineProductsByName: { body: fx.mockMedicineProducts },
        externalMedicinePricesGetMedicineProductsByIngredients: { body: fx.mockMedicineProducts },
        externalMedicinePricesGetMedicineProductDetails: { body: fx.mockMedicineDetail },

        locationGetAllLocations: { body: fx.mockLocations },
        locationGet: { body: fx.mockLocation },
        locationGetAllFloors: { body: fx.mockLocation.floorsWithRooms },
        locationGetFloor: { body: fx.mockFloorRooms },
        locationPostFloor: { body: 100 },
        locationPutFloor: () => new HttpResponse(null, { status: 204 }),
        locationDeleteFloor: { body: null },

        medicinGetAllMedicins: { body: fx.mockMedications },
        medicinGet: { body: fx.mockMedication },
        medicinPost: { body: 100 },
        medicinPut: { body: null },
        medicinDelete: { body: null },

        missingStorageGetAllMedicationStorageMissings: { body: fx.mockMissings },
        missingStorageGet: { body: fx.mockMissing },
        missingStoragePost: { body: 100 },
        missingStoragePut: { body: null },
        missingStorageDelete: { body: null },

        patientGetAllPatients: { body: fx.mockPatients },
        patientGet: { body: fx.mockPatient },
        patientPost: { body: 100 },
        patientPut: { body: null },
        patientDelete: { body: null },

        prescriptionGetAllPrescriptions: { body: fx.mockPrescriptions },
        prescriptionGet: { body: fx.mockPrescription },
        prescriptionPost: { body: 100 },
        prescriptionPut: { body: null },
        prescriptionDelete: { body: null },

        roomBookingGetAll: { body: fx.mockRoomBookings },
        roomBookingGet: { body: fx.mockRoomBooking },
        roomBookingPost: { body: 100 },
        roomBookingPut: { body: null, status: 200 },
        roomBookingDelete: { body: null },

        staffGetAllStaffs: { body: fx.mockStaffs },
        staffGet: { body: fx.mockStaff },
        staffPost: { body: 100 },
        staffPut: { body: null },
        staffDelete: { body: null },

        storageGetAllMedicationStorages: { body: fx.mockStorages },
        storageGet: { body: fx.mockStorage },
        storagePost: { body: 100 },
        storagePut: { body: null },
        storageDelete: { body: null },

        treatmentGetAllTreatments: { body: fx.mockTreatments },
        treatmentGet: { body: fx.mockTreatment },
        treatmentPost: { body: 100 },
        treatmentPut: { body: null },
        treatmentDelete: { body: null },

        treatmentStaffGetAll: { body: fx.mockTreatmentStaffs },
        treatmentStaffGet: { body: fx.mockTreatmentStaff },
        treatmentStaffPost: { body: 100 },
        treatmentStaffPut: { body: null },
        treatmentStaffDelete: { body: null },

        userGetAll: { body: fx.mockUsers },
        userRegister: { body: true },
        userChangePassword: { body: null },
        userDelete: { body: null },
    },
});
