import { HttpResponse } from "msw";
import { createMswHandlers } from "../api/msw.gen";
import { mockE2eExternalMedicinSearchResults, mockE2eExternalMedicinDetail } from "./fixtures/externalMedicinePrices";

const { pick } = createMswHandlers();

const getParam = (request: Request, name: string) => new URL(request.url).searchParams.get(name);

const E2E_MEDICINE_NAME = "panodil";
const E2E_MEDICINE_INGREDIENT = "paracetamol";
const E2E_MEDICINE_DETAIL_ID = "118420";

export const e2eExternalMedicinHandlers = [
    pick.externalMedicinePricesGetMedicineProductsByName(({ request }) => {
        const name = getParam(request, "productName");
        if (name?.toLowerCase() === E2E_MEDICINE_NAME) {
            return HttpResponse.json(mockE2eExternalMedicinSearchResults);
        }
        return HttpResponse.json([], { status: 404 });
    }),

    pick.externalMedicinePricesGetMedicineProductsByIngredients(({ request }) => {
        const ingredient = getParam(request, "ingredientName");
        if (ingredient?.toLowerCase() === E2E_MEDICINE_INGREDIENT) {
            return HttpResponse.json(mockE2eExternalMedicinSearchResults);
        }
        return HttpResponse.json([], { status: 404 });
    }),

    pick.externalMedicinePricesGetMedicineProductDetails(({ request }) => {
        const productDetailId = getParam(request, "productDetailId");

        if (productDetailId === E2E_MEDICINE_DETAIL_ID) {
            return HttpResponse.json(mockE2eExternalMedicinDetail);
        }
        return HttpResponse.json({ message: "Product not found" }, { status: 404 });
    })
];
