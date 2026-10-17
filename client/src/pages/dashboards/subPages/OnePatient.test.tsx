import { expect, test } from "vitest";
import { matchScreenshot } from "../../../test-utils/matchScreenshot";
import { render } from "vitest-browser-react";
import { MemoryRouter, Route, Routes } from "react-router";
import OnePatient from "./OnePatient";
import { Provider } from "../../../components/ui/provider";

// OnePatient reads the patient id from the route (useParams), so it needs a
// matching <Route>. PatientService.getById is served by the default MSW
// handler, which looks the patient up by id - patient 1 is mockPatientResponse,
// and treatments 1-2 belong to it - see mocks/fixtures/responses/PatientFixture.ts
// and TreatmentFixture.ts.
function renderOnePatient() {
    return render(
        <Routes>
            <Route path="/app/patients/:id" element={<OnePatient />} />
        </Routes>,
        {
            wrapper: ({ children }) => (
                <Provider>
                    <MemoryRouter initialEntries={["/app/patients/1"]}>{children}</MemoryRouter>
                </Provider>
            ),
        },
    );
}

test("loads the patient and their treatment history", async () => {
    const { getByTestId, container } = await renderOnePatient();

    await expect.element(getByTestId("one-patient-heading")).toHaveTextContent("Lars Jensen");
    await expect.element(getByTestId("one-patient-field-cpr")).toHaveTextContent("0101801234");

    await expect
        .element(getByTestId("patient-treatments-table-row-0-cell-description"))
        .toHaveTextContent("Initial examination and blood test.");

    await matchScreenshot(container, "one-patient");
});
