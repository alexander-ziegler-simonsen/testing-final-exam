import type { MedicationResponse } from "../../../api/Responses/MedicationResponse";

export const mockMedicationResponse: MedicationResponse = {
    id: 1,
    name: "Panodil",
    genericName: "Paracetamol",
    brand: "Haleon",
    form: "Tablet",
    strength: "500 mg",
    category: "Analgesic",
    description: "Relieves mild to moderate pain and reduces fever.",
};

export const mockMedicationResponses: MedicationResponse[] = [
    mockMedicationResponse,
    {
        id: 2,
        name: "Ipren",
        genericName: "Ibuprofen",
        brand: "Takeda",
        form: "Tablet",
        strength: "400 mg",
        category: "NSAID",
        description: "Reduces pain, fever and inflammation.",
    },
    {
        id: 3,
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
export const mockMedicationResponsesWithNulls: MedicationResponse[] = [
    { ...mockMedicationResponse, id: 11, name: null },
    { ...mockMedicationResponse, id: 12, genericName: null },
    { ...mockMedicationResponse, id: 13, brand: null },
    { ...mockMedicationResponse, id: 14, form: null },
    { ...mockMedicationResponse, id: 15, strength: null },
    { ...mockMedicationResponse, id: 16, category: null },
    { ...mockMedicationResponse, id: 17, description: null },
];
