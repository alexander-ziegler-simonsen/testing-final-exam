import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { MemoryRouter, Route, Routes } from "react-router";
import OnePatient from "./OnePatient";
import { Provider } from "../../components/ui/provider";

// OnePatient reads the patient id from the route (useParams), so it needs a
// matching <Route>. PatientService.getById is served by the default MSW
// handler regardless of which id is requested, returning mockPatient (id 42)
// - see mocks/fixtures/patient.ts.
function renderOnePatient() {
    return render(
        <Routes>
            <Route path="/app/patients/:id" element={<OnePatient />} />
        </Routes>,
        {
            wrapper: ({ children }) => (
                <Provider>
                    <MemoryRouter initialEntries={["/app/patients/42"]}>{children}</MemoryRouter>
                </Provider>
            ),
        },
    );
}

test("loads the patient and their treatment history", async () => {
    const { getByTestId, container } = await renderOnePatient();

    await expect.element(getByTestId("one-patient-heading")).toHaveTextContent("Mette Sørensen");
    await expect.element(getByTestId("one-patient-field-cpr")).toHaveTextContent("1503851234");

    await expect
        .element(getByTestId("patient-treatments-table-row-0-cell-description"))
        .toHaveTextContent("Rutinetjek og blodprøve");

    await expect(container).toMatchScreenshot("one-patient");
});
