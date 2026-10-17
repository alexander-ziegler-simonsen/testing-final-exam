import { expect, test } from "vitest";
import { matchScreenshot } from "../../../test-utils/matchScreenshot";
import { render } from "vitest-browser-react";
import MissingMedicin from "./MissingMedicin";
import { Provider } from "../../../components/ui/provider";

// MissingMedicin only renders Chakra components (no router/auth involved),
// and fetches via MedicationStorageMissingService, served by the default MSW
// handler - see mocks/fixtures/responses/MedicationStorageMissingFixture.ts.
function renderMissingMedicin() {
    return render(<MissingMedicin />, {
        wrapper: ({ children }) => <Provider>{children}</Provider>,
    });
}

test("loads missing-storage reports and renders them in the table", async () => {
    const { getByTestId, container } = await renderMissingMedicin();

    await expect.element(getByTestId("missing-medicine-page-heading")).toBeInTheDocument();

    await expect
        .element(getByTestId("missing-medicine-table-row-0-cell-amountMissing"))
        .toHaveTextContent("5");
    await expect
        .element(getByTestId("missing-medicine-table-row-0-cell-fkMedicationStorageId"))
        .toHaveTextContent("1");

    await matchScreenshot(container, "missing-medicin");
});
