import { expect, test } from "vitest";
import { matchScreenshot } from "../../../test-utils/matchScreenshot";
import { render } from "vitest-browser-react";
import DepartmentStaff from "./DepartmentStaff";
import { Provider } from "../../../components/ui/provider";

function renderDepartmentStaff() {
    return render(<DepartmentStaff />, {
        wrapper: ({ children }) => <Provider>{children}</Provider>,
    });
}

test("loads department-staff links and renders the joined names", async () => {
    const { getByTestId, container } = await renderDepartmentStaff();

    await expect.element(getByTestId("department-staff-page-heading")).toBeInTheDocument();

    await expect
        .element(getByTestId("department-staff-table-row-0-cell-department"))
        .toHaveTextContent("Cardiology (Medical)");
    await expect
        .element(getByTestId("department-staff-table-row-0-cell-staff"))
        .toHaveTextContent("Karen Holm");

    await matchScreenshot(container, "department-staff");
});
