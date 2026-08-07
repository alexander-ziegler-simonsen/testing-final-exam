import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { MemoryRouter } from "react-router";
import Patients from "./Patients";
import { Provider } from "../../components/ui/provider";

// Patients fetches via PatientService, served here by the default MSW
// handlers, which return the fixtures from mocks/fixtures/patient.ts.
function renderPatients() {
    return render(<Patients />, {
        wrapper: ({ children }) => (
            <Provider>
                <MemoryRouter>{children}</MemoryRouter>
            </Provider>
        ),
    });
}

test("loads patients from the API and renders them in the table", async () => {
    const { getByTestId } = await renderPatients();

    await expect.element(getByTestId("patients-page-heading")).toBeInTheDocument();

    await expect
        .element(getByTestId("patients-table-row-0-cell-firstname"))
        .toHaveTextContent("Mette");
    await expect
        .element(getByTestId("patients-table-row-0-cell-lastname"))
        .toHaveTextContent("Sørensen");
    await expect
        .element(getByTestId("patients-table-row-0-cell-cprNumber"))
        .toHaveTextContent("1503851234");
});
