import { expect, test } from "vitest";
import { matchScreenshot } from "../../../test-utils/matchScreenshot";
import { render } from "vitest-browser-react";
import { MemoryRouter, Route, Routes } from "react-router";
import OneMedicin from "./OneMedicin";
import { Provider } from "../../../components/ui/provider";

// OneMedicin reads the storage id from the route (useParams), so it needs a
// matching <Route>. MedicationStorageService.getById and
// MedicationService.getById are served by the default MSW handlers, which
// look the rows up by id - storage 1 points at medication 1 ("Panodil").
function renderOneMedicin() {
    return render(
        <Routes>
            <Route path="/app/medicin_storage/:id" element={<OneMedicin />} />
        </Routes>,
        {
            wrapper: ({ children }) => (
                <Provider>
                    <MemoryRouter initialEntries={["/app/medicin_storage/1"]}>{children}</MemoryRouter>
                </Provider>
            ),
        },
    );
}

test("loads the storage row and its medication details", async () => {
    const { getByTestId, container } = await renderOneMedicin();

    await expect.element(getByTestId("one-medicin-heading")).toHaveTextContent("Panodil");
    await expect.element(getByTestId("one-medicin-field-amount")).toHaveTextContent("120");
    await expect
        .element(getByTestId("one-medicin-field-generic-name"))
        .toHaveTextContent("Paracetamol");

    await matchScreenshot(container, "one-medicin");
});
