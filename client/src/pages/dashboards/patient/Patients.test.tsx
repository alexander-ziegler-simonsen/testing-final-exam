import { expect, test } from "vitest";

import { render } from "vitest-browser-react";
import { MemoryRouter } from "react-router";
import Patients from "./Patients";
import { Provider } from "../../../components/ui/provider";
import { matchScreenshot } from "../../../test-utils/matchScreenshot";

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
    const { getByTestId, container } = await renderPatients();

    await expect.element(getByTestId("patients-page-heading")).toBeInTheDocument();

    await expect
        .element(getByTestId("patients-table-row-0-cell-firstname"))
        .toHaveTextContent("Lars");
    await expect
        .element(getByTestId("patients-table-row-0-cell-lastname"))
        .toHaveTextContent("Jensen");
    await expect
        .element(getByTestId("patients-table-row-0-cell-cprNumber"))
        .toHaveTextContent("0101801234");

    await matchScreenshot(container, "patients");
});
