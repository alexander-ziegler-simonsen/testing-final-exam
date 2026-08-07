import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { MemoryRouter } from "react-router";
import Departments from "./Departments";
import { Provider } from "../../components/ui/provider";

// Departments fetches via DepartmentService, served here by the default MSW
// handlers (see mocks/handlers.ts), which return the fixtures from
// mocks/fixtures/department.ts.
function renderDepartments() {
    return render(<Departments />, {
        wrapper: ({ children }) => (
            <Provider>
                <MemoryRouter>{children}</MemoryRouter>
            </Provider>
        ),
    });
}

test("loads departments from the API and renders them in the table", async () => {
    const { getByTestId } = await renderDepartments();

    await expect.element(getByTestId("departments-page-heading")).toBeInTheDocument();

    await expect
        .element(getByTestId("departments-table-row-0-cell-name"))
        .toHaveTextContent("Cardiology");
    await expect
        .element(getByTestId("departments-table-row-0-cell-type"))
        .toHaveTextContent("Medical");
});
