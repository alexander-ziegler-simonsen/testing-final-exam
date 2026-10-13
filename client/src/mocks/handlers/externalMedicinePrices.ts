import { HttpResponse } from "msw";
import { createMswHandlers } from "../../api/msw.gen";
import { mockMedicineProducts, mockMedicineDetail } from "../fixtures/externalMedicinePrices";

const { pick } = createMswHandlers();

const getParam = (request: Request, name: string) => new URL(request.url).searchParams.get(name)?.trim().toLowerCase() ?? "";

export const externalMedicinePricesHandlers = [
    pick.externalMedicinePricesGetMedicineProductsByName(({ request }) => {
        const productName = getParam(request, "productName");
        const matches = mockMedicineProducts.filter((p) => p.navn.toLowerCase().includes(productName));

        if (matches.length === 0) {
            return HttpResponse.json({ title: "Not Found", status: 404, detail: `No products found for "${productName}"` }, { status: 404 });
        }
        return HttpResponse.json(matches);
    }),

    pick.externalMedicinePricesGetMedicineProductsByIngredients(({ request }) => {
        const ingredientName = getParam(request, "ingredientName");
        const matches = mockMedicineProducts.filter((p) => p.navn.toLowerCase().includes(ingredientName));

        if (matches.length === 0) {
            return HttpResponse.json({ title: "Not Found", status: 404, detail: `No products found for ingredient "${ingredientName}"` }, { status: 404 });
        }
        return HttpResponse.json(matches);
    }),

    pick.externalMedicinePricesGetMedicineProductDetails({ body: mockMedicineDetail }),
];
