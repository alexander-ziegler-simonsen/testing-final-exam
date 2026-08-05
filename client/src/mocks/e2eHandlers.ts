import { HttpResponse } from "msw";
import { createMswHandlers } from "../api/msw.gen";
import { mockE2eExternalMedicinSearchResults, mockE2eExternalMedicinDetail } from "./fixtures/externalMedicinePrices";

const { pick } = createMswHandlers();

// Used only in e2e runs: mocks the 3 endpoints that proxy out to the real
// api.medicinpriser.dk (see api/Services/ExternalApiService.cs) so those
// runs never depend on - or hit - that external service. Every other
// endpoint is left unhandled here and falls through to the real local API
// (worker started with onUnhandledRequest: "bypass" in BrowserExternalOnly.ts).
export const e2eExternalMedicinHandlers = [
    pick.externalMedicinePricesGetMedicineProductsByName({ body: mockE2eExternalMedicinSearchResults }),
    pick.externalMedicinePricesGetMedicineProductsByIngredients({ body: mockE2eExternalMedicinSearchResults }),
    pick.externalMedicinePricesGetMedicineProductDetails(({ request }) => {
        const productDetailId = new URL(request.url).searchParams.get("productDetailId");

        if (productDetailId === "008453") {
            // A null/empty body here would make axios hand back "" as the
            // error payload, which is falsy - the client's `if (error) throw`
            // check would silently no-op and the page would hang on
            // "Loading medicin details..." forever instead of showing the
            // error. The body must be non-empty so `error` is truthy.
            return HttpResponse.json({ message: "Product not found" }, { status: 404 });
        }

        return HttpResponse.json({
            ...mockE2eExternalMedicinDetail,
            varenummer: productDetailId ?? mockE2eExternalMedicinDetail.varenummer,
        });
    }),
];
