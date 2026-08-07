import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { MemoryRouter, Route, Routes } from "react-router";
import OneMedicin from "./OneMedicin";
import { Provider } from "../../components/ui/provider";

// OneMedicin reads the storage id from the route (useParams), so it needs a
// matching <Route>. MedicationStorageService.getById and
// MedicationService.getById are served by the default MSW handlers
// regardless of which id is requested, returning mockStorage/mockMedication.
function renderOneMedicin() {
    return render(
        <Routes>
            <Route path="/app/medicin_storage/:id" element={<OneMedicin />} />
        </Routes>,
        {
            wrapper: ({ children }) => (
                <Provider>
                    <MemoryRouter initialEntries={["/app/medicin_storage/5"]}>{children}</MemoryRouter>
                </Provider>
            ),
        },
    );
}

test("loads the storage row and its medication details", async () => {
    const { getByTestId, container } = await renderOneMedicin();

    await expect.element(getByTestId("one-medicin-heading")).toHaveTextContent("Panodil");
    await expect.element(getByTestId("one-medicin-field-amount")).toHaveTextContent("142");
    await expect
        .element(getByTestId("one-medicin-field-generic-name"))
        .toHaveTextContent("Paracetamol");

    await expect(container).toMatchScreenshot("one-medicin");
});
