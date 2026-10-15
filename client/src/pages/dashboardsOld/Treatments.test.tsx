import { expect, test } from "vitest";
import { matchScreenshot } from "../../test-utils/matchScreenshot";
import { render } from "vitest-browser-react";
import { MemoryRouter } from "react-router";
import Treatments from "./Treatments";
import { Provider } from "../../components/ui/provider";

// Treatments fetches via TreatmentService, served here by the default MSW
// handlers, which return the fixtures from mocks/fixtures/treatment.ts.
function renderTreatments() {
    return render(<Treatments />, {
        wrapper: ({ children }) => (
            <Provider>
                <MemoryRouter>{children}</MemoryRouter>
            </Provider>
        ),
    });
}

test("loads treatments from the API and renders them in the table", async () => {
    const { getByTestId, container } = await renderTreatments();

    await expect.element(getByTestId("treatments-page-heading")).toBeInTheDocument();

    await expect
        .element(getByTestId("treatments-table-row-0-cell-description"))
        .toHaveTextContent("Rutinetjek og blodprøve");
    await expect
        .element(getByTestId("treatments-table-row-0-cell-fkPatientId"))
        .toHaveTextContent("42");

    await matchScreenshot(container, "treatments");
});
