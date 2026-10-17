import { http, HttpResponse } from "msw";
import { mockMedicineProductResponse, mockMedicineProductResponses } from "../fixtures/responses/MedicineProductFixture";
import { mockMedicineDetailResponse } from "../fixtures/responses/MedicineDetailFixture";

const getParam = (request: Request, name: string) => new URL(request.url).searchParams.get(name);

const E2E_MEDICINE_NAME = "panodil";
const E2E_MEDICINE_INGREDIENT = "paracetamol";
// the detail page is opened with the product's varenummer
const E2E_MEDICINE_DETAIL_ID = mockMedicineProductResponse.varenummer;

export const e2eExternalMedicinHandlers = [
    http.get("*/api/ExternalMedicinePrices/productsByName", ({ request }) => {
        const name = getParam(request, "productName");
        if (name?.toLowerCase() === E2E_MEDICINE_NAME) {
            return HttpResponse.json(mockMedicineProductResponses);
        }
        return HttpResponse.json([], { status: 404 });
    }),

    http.get("*/api/ExternalMedicinePrices/productsByIngredient", ({ request }) => {
        const ingredient = getParam(request, "ingredientName");
        if (ingredient?.toLowerCase() === E2E_MEDICINE_INGREDIENT) {
            return HttpResponse.json(mockMedicineProductResponses);
        }
        return HttpResponse.json([], { status: 404 });
    }),

    http.get("*/api/ExternalMedicinePrices/productDetails", ({ request }) => {
        const productDetailId = getParam(request, "productDetailId");

        if (productDetailId === E2E_MEDICINE_DETAIL_ID) {
            return HttpResponse.json(mockMedicineDetailResponse);
        }
        return HttpResponse.json({ message: "Product not found" }, { status: 404 });
    })
];
