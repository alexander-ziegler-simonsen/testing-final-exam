import { expect, test } from "vitest";
import { matchScreenshot } from "../../../test-utils/matchScreenshot";
import { render } from "vitest-browser-react";
import { MemoryRouter, Route, Routes } from "react-router";
import OneTreatment from "./OneTreatment";
import { Provider } from "../../../components/ui/provider";

// OneTreatment reads the treatment id from the route (useParams), so it
// needs a matching <Route>. TreatmentService.getById is served by the
// default MSW handler, which looks the treatment up by id - treatment 1 is for
// patient 1, has staff 1 and 2 linked, and prescription 1 (medication 1) - see
// mocks/fixtures/responses/TreatmentFixture.ts, TreatmentStaffFixture.ts and
// PrescriptionFixture.ts.
function renderOneTreatment() {
    return render(
        <Routes>
            <Route path="/app/treatment/:id" element={<OneTreatment />} />
        </Routes>,
        {
            wrapper: ({ children }) => (
                <Provider>
                    <MemoryRouter initialEntries={["/app/treatment/1"]}>{children}</MemoryRouter>
                </Provider>
            ),
        },
    );
}

test("loads the treatment with its patient, staff, and prescriptions", async () => {
    const { getByTestId, container } = await renderOneTreatment();

    await expect.element(getByTestId("one-treatment-heading")).toHaveTextContent("Treatment #1");
    await expect
        .element(getByTestId("one-treatment-patient-link"))
        .toHaveTextContent("Lars Jensen");

    await expect
        .element(getByTestId("treatment-staff-table-row-0-cell-firstname"))
        .toHaveTextContent("John");
    await expect
        .element(getByTestId("treatment-prescriptions-table-row-0-cell-medicationName"))
        .toHaveTextContent("Panodil");

    await matchScreenshot(container, "one-treatment");
});
