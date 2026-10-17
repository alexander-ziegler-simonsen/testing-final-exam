import type { MedicationRequest } from "../../../api/Requests/MedicationRequest";

export const mockMedicationRequest: MedicationRequest = {
    name: "Panodil",
    genericName: "Paracetamol",
    brand: "Haleon",
    form: "Tablet",
    strength: "500 mg",
    category: "Analgesic",
    description: "Relieves mild to moderate pain and reduces fever.",
};

export const mockMedicationRequests: MedicationRequest[] = [
    mockMedicationRequest,
    {
        name: "Ipren",
        genericName: "Ibuprofen",
        brand: "Takeda",
        form: "Tablet",
        strength: "400 mg",
        category: "NSAID",
        description: "Reduces pain, fever and inflammation.",
    },
    {
        name: "Imacillin",
        genericName: "Amoxicillin",
        brand: "Meda",
        form: "Capsule",
        strength: "500 mg",
        category: "Antibiotic",
        description: "Treats bacterial infections.",
    },
];

// one entry per nullable field, with only that field set to null
export const mockMedicationRequestsWithNulls: MedicationRequest[] = [
    { ...mockMedicationRequest, name: null },
    { ...mockMedicationRequest, genericName: null },
    { ...mockMedicationRequest, brand: null },
    { ...mockMedicationRequest, form: null },
    { ...mockMedicationRequest, strength: null },
    { ...mockMedicationRequest, category: null },
    { ...mockMedicationRequest, description: null },
];
