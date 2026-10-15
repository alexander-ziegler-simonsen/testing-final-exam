import { expect, test } from "vitest";
import { matchScreenshot } from "../../test-utils/matchScreenshot";
import { render } from "vitest-browser-react";
import { MemoryRouter, Route, Routes } from "react-router";
import OneTreatment from "./OneTreatment";
import { Provider } from "../../components/ui/provider";

// OneTreatment reads the treatment id from the route (useParams), so it
// needs a matching <Route>. TreatmentService.getById is served by the
// default MSW handler regardless of which id is requested, returning
// mockTreatment (id 6); both fixture prescriptions and treatment-staff links
// point at treatment id 6 - see mocks/fixtures/treatment.ts and
// prescription.ts.
function renderOneTreatment() {
    return render(
        <Routes>
            <Route path="/app/treatment/:id" element={<OneTreatment />} />
        </Routes>,
        {
            wrapper: ({ children }) => (
                <Provider>
                    <MemoryRouter initialEntries={["/app/treatment/6"]}>{children}</MemoryRouter>
                </Provider>
            ),
        },
    );
}

test("loads the treatment with its patient, staff, and prescriptions", async () => {
    const { getByTestId, container } = await renderOneTreatment();

    await expect.element(getByTestId("one-treatment-heading")).toHaveTextContent("Treatment #6");
    await expect
        .element(getByTestId("one-treatment-patient-link"))
        .toHaveTextContent("Mette Sørensen");

    await expect
        .element(getByTestId("treatment-staff-table-row-0-cell-firstname"))
        .toHaveTextContent("Karen");
    await expect
        .element(getByTestId("treatment-prescriptions-table-row-0-cell-medicationName"))
        .toHaveTextContent("Panodil");

    await matchScreenshot(container, "one-treatment");
});
