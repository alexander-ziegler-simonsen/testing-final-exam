import { expect, test } from "vitest";
import { matchScreenshot } from "../../test-utils/matchScreenshot";
import { render } from "vitest-browser-react";
import { MemoryRouter, Route, Routes } from "react-router";
import OneExternalMedicin from "./OneExternalMedicin";
import { Provider } from "../../components/ui/provider";

// OneExternalMedicin reads the varenummer from the route (useParams), so it
// needs a matching <Route>. ExternalMedicinePricesService.productDetails is
// served by the default MSW handler regardless of which id is requested,
// returning mockMedicineDetail - see mocks/fixtures/externalMedicinePrices.ts.
function renderOneExternalMedicin() {
    return render(
        <Routes>
            <Route path="/app/external_medicin/:id" element={<OneExternalMedicin />} />
        </Routes>,
        {
            wrapper: ({ children }) => (
                <Provider>
                    <MemoryRouter initialEntries={["/app/external_medicin/118420"]}>{children}</MemoryRouter>
                </Provider>
            ),
        },
    );
}

test("loads and renders the product's details", async () => {
    const { getByTestId, container } = await renderOneExternalMedicin();

    await expect.element(getByTestId("one-external-medicin-heading")).toHaveTextContent("Panodil");
    await expect
        .element(getByTestId("one-external-medicin-field-virksomt-stof"))
        .toHaveTextContent("Paracetamol");
    await expect
        .element(getByTestId("one-external-medicin-field-firma"))
        .toHaveTextContent("GlaxoSmithKline Consumer Healthcare");

    await matchScreenshot(container, "one-external-medicin");
});
