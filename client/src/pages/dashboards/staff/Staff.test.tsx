import { expect, test } from "vitest";
import { matchScreenshot } from "../../../test-utils/matchScreenshot";
import { render } from "vitest-browser-react";
import { MemoryRouter } from "react-router";
import { Provider } from "../../../components/ui/provider";
import Staff from "./Staff";

// Staff fetches users/staff/patients via their services, served here by the
// default MSW handlers, which return the fixtures from mocks/fixtures/responses/*.
function renderStaff() {
    return render(<Staff />, {
        wrapper: ({ children }) => (
            <Provider>
                <MemoryRouter>{children}</MemoryRouter>
            </Provider>
        ),
    });
}

test("loads user accounts and resolves the linked staff member's name", async () => {
    const { getByTestId, container } = await renderStaff();

    await expect.element(getByTestId("staff-page-heading")).toBeInTheDocument();

    await expect
        .element(getByTestId("staff-table-row-0-cell-username"))
        .toHaveTextContent("jsmith");
    // mockUserResponse.fkStaffId (1) is resolved against the staff list to "John Smith".
    await expect
        .element(getByTestId("staff-table-row-0-cell-fkStaffId"))
        .toHaveTextContent("John Smith");

    await matchScreenshot(container, "staff");
});
